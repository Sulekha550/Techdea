import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Notification from "../models/Notification.js";

export const createPaymentRecord = async (req, res) => {
  try {
    const { courseId, semesterId, amount, orderId, paymentMethod } = req.body;

    if (!courseId && !semesterId) {
      return res.status(400).json({
        success: false,
        message: "courseId or semesterId is required"
      });
    }

    if (amount === undefined || Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid payment amount is required"
      });
    }

    const generatedOrderId = orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await Payment.create({
      student: req.user._id,
      course: courseId || null,
      semester: semesterId || null,
      amount: Number(amount),
      orderId: generatedOrderId,
      paymentMethod: paymentMethod || "Online / UPI",
      status: "pending"
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, transactionRef, courseId, semesterId } = req.body;

    let payment = null;
    if (paymentId) {
      payment = await Payment.findById(paymentId);
    } else if (transactionRef) {
      payment = await Payment.findOne({ orderId: transactionRef });
    }

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    // Mark payment completed
    payment.status = "completed";
    payment.paymentId = transactionRef || `TXN-${Date.now()}`;
    await payment.save();

    // Activate enrollment
    const targetCourseId = payment.course || courseId;
    const targetSemesterId = payment.semester || semesterId;

    let enrollment = null;
    if (targetCourseId) {
      enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: targetCourseId
      });

      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: req.user._id,
          course: targetCourseId,
          status: "active",
          paymentStatus: "paid"
        });
      } else {
        enrollment.status = "active";
        enrollment.paymentStatus = "paid";
        await enrollment.save();
      }
    } else if (targetSemesterId) {
      enrollment = await Enrollment.findOne({
        student: req.user._id,
        semester: targetSemesterId
      });

      if (!enrollment) {
        enrollment = await Enrollment.create({
          student: req.user._id,
          semester: targetSemesterId,
          status: "active",
          paymentStatus: "paid"
        });
      } else {
        enrollment.status = "active";
        enrollment.paymentStatus = "paid";
        await enrollment.save();
      }
    }

    await Notification.create({
      user: req.user._id,
      title: "Payment Confirmed",
      message: `Your payment of ₹${payment.amount} was verified. Course access is now active!`,
      type: "success",
      link: "/dashboard"
    });

    res.json({
      success: true,
      message: "Payment successfully verified! Your course is now unlocked.",
      payment,
      enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const myPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id })
      .populate("course", "name price")
      .populate("semester", "number title price")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name email phone")
      .populate("course", "name price")
      .populate("semester", "number title price")
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};