import User from "../models/User.js";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import Test from "../models/Test.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Certificate from "../models/Certificate.js";
import ContactMessage from "../models/ContactMessage.js";

export const dashboardStats = async (req, res) => {
  try {
    const [
      students,
      activeStudents,
      courses,
      modules,
      lectures,
      enrollments,
      payments,
      tests,
      certificates,
      contactMessages,
      newContactMessages,
      recentEnrollments,
      recentMessages
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", isActive: true }),
      Course.countDocuments({ isActive: true }),
      Module.countDocuments({ isActive: true }),
      Lecture.countDocuments({ isPublished: true }),
      Enrollment.countDocuments({ status: { $in: ["active", "completed"] } }),
      Payment.find({ status: "completed" }).select("amount"),
      Test.countDocuments({ isPublished: true }),
      Certificate.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "NEW" }),
      Enrollment.find()
        .populate("student", "name email")
        .populate("course", "name price")
        .sort({ createdAt: -1 })
        .limit(5),
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        students,
        activeStudents,
        courses,
        modules,
        lectures,
        enrollments,
        totalRevenue,
        tests,
        certificates,
        contactMessages,
        newContactMessages
      },
      recentEnrollments,
      recentMessages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      { isActive: req.body.isActive },
      { new: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};