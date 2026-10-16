import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Notification from "../models/Notification.js";

export const createEnrollment = async (req, res) => {
  try {
    const { courseId, semesterId } = req.body;

    if (!courseId && !semesterId) {
      return res.status(400).json({
        success: false,
        message: "courseId or semesterId is required"
      });
    }

    let isFree = false;
    let targetCourse = null;
    let targetSemester = null;

    if (courseId) {
      targetCourse = await Course.findById(courseId);
      if (!targetCourse || !targetCourse.isActive || !targetCourse.isPublished) {
        return res.status(404).json({ success: false, message: "Course unavailable" });
      }

      const existing = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
      });

      if (existing) {
        return res.json({
          success: true,
          message: "Already enrolled",
          enrollment: existing
        });
      }

      isFree = (targetCourse.price || 0) <= 0;
    } else if (semesterId) {
      targetSemester = await Semester.findById(semesterId);
      if (!targetSemester || !targetSemester.isActive || !targetSemester.isPublished) {
        return res.status(404).json({ success: false, message: "Semester unavailable" });
      }

      const existing = await Enrollment.findOne({
        student: req.user._id,
        semester: semesterId
      });

      if (existing) {
        return res.json({
          success: true,
          message: "Already enrolled",
          enrollment: existing
        });
      }

      isFree = (targetSemester.price || 0) <= 0;
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId || null,
      semester: semesterId || null,
      status: isFree ? "active" : "pending",
      paymentStatus: isFree ? "free" : "pending"
    });

    // Notify student
    await Notification.create({
      user: req.user._id,
      title: isFree ? "Enrollment Activated" : "Enrollment Pending",
      message: isFree
        ? `You have successfully enrolled in ${targetCourse?.name || targetSemester?.title}.`
        : `Your enrollment is pending payment verification.`,
      type: "enrollment",
      link: "/dashboard"
    });

    res.status(201).json({
      success: true,
      message: isFree ? "Enrolled successfully!" : "Enrollment registered, awaiting payment.",
      enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const myEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course", "name shortDescription thumbnail image price level duration")
      .populate("semester", "number title price course")
      .sort({ createdAt: -1 });

    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkCourseEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    const enrolled = Boolean(
      enrollment && ["active", "completed"].includes(enrollment.status)
    );

    res.json({
      success: true,
      enrolled,
      enrollment: enrollment || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEnrollment = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      semester: semesterId
    }).populate("semester");

    res.json({
      success: true,
      enrolled: Boolean(enrollment && ["active", "completed"].includes(enrollment.status)),
      enrollment: enrollment || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email phone")
      .populate("course", "name price")
      .populate("semester", "number title price")
      .sort({ createdAt: -1 });

    res.json({ success: true, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};