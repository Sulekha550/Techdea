import crypto from "crypto";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Progress from "../models/Progress.js";
import Notification from "../models/Notification.js";

export const claimCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check existing certificate
    const existing = await Certificate.findOne({
      student: req.user._id,
      course: courseId
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Certificate already issued",
        certificate: existing
      });
    }

    // Verify course completion criteria
    const modules = await Module.find({ course: courseId, isActive: true }).select("_id");
    const moduleIds = modules.map((m) => m._id);

    const publishedLectures = await Lecture.find({
      module: { $in: moduleIds },
      isPublished: true
    }).select("_id");

    const totalLessons = publishedLectures.length;
    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: "This course does not contain published lessons yet."
      });
    }

    const completedCount = await Progress.countDocuments({
      student: req.user._id,
      lecture: { $in: publishedLectures.map((l) => l._id) },
      completed: true
    });

    const percentage = Math.round((completedCount / totalLessons) * 100);

    if (percentage < 100) {
      return res.status(400).json({
        success: false,
        message: `Course completion criteria not met. Current progress: ${percentage}% (${completedCount}/${totalLessons} lessons). Complete all lessons to claim certificate.`
      });
    }

    // Generate unique Certificate ID
    const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
    const certificateId = `TC-${Date.now().toString(36).toUpperCase()}-${randomHex}`;

    const clientUrl = process.env.CLIENT_URL?.split(",")[0] || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify/${certificateId}`;

    const certificate = await Certificate.create({
      certificateId,
      student: req.user._id,
      studentName: req.user.name,
      course: courseId,
      courseTitle: course.name,
      issueDate: new Date(),
      completionPercentage: 100,
      grade: "Distinction",
      verificationUrl,
      isValid: true
    });

    await Notification.create({
      user: req.user._id,
      title: "Certificate Earned!",
      message: `Congratulations! You have completed "${course.name}" and your official TechDea Certificate is ready.`,
      type: "certificate",
      link: "/dashboard"
    });

    res.status(201).json({
      success: true,
      message: "Certificate generated successfully!",
      certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate("course", "name image thumbnail duration level")
      .sort({ createdAt: -1 });

    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId: certificateId.trim().toUpperCase()
    })
      .populate("student", "name email")
      .populate("course", "name duration level");

    if (!certificate || !certificate.isValid) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Certificate could not be verified or has been revoked."
      });
    }

    res.json({
      success: true,
      verified: true,
      certificate: {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
        completionPercentage: certificate.completionPercentage,
        platform: "TechDea Learning Platform",
        verifiedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
