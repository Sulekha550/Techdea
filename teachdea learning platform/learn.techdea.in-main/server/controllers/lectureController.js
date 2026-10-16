import Lecture from "../models/Lecture.js";
import Module from "../models/Module.js";
import Enrollment from "../models/Enrollment.js";

export const getLectures = async (req, res) => {
  try {
    const filter = {};

    if (req.query.all !== "true") {
      filter.isPublished = true;
    }

    if (req.query.module) {
      filter.module = req.query.module;
    }

    const lectures = await Lecture.find(filter)
      .populate({
        path: "module",
        select: "title course subject",
        populate: { path: "course", select: "name" }
      })
      .sort({ order: 1 });

    res.json({ success: true, lectures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate({
      path: "module",
      select: "title course subject",
      populate: { path: "course", select: "name price isPublished" }
    });

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    // Access check:
    // If preview or free course or user is admin, allow access
    // Otherwise check enrollment
    let hasAccess = lecture.isPreview || (req.user && req.user.role === "admin");

    if (!hasAccess && req.user && lecture.module?.course) {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: lecture.module.course._id,
        status: { $in: ["active", "completed"] }
      });
      if (enrollment) {
        hasAccess = true;
      }
    }

    res.json({
      success: true,
      lecture,
      hasAccess: Boolean(hasAccess)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { module: moduleId, order } = req.body;

    const moduleExists = await Module.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    let finalOrder = order;
    if (finalOrder === undefined) {
      const highest = await Lecture.findOne({ module: moduleId }).sort({ order: -1 });
      finalOrder = (highest?.order || 0) + 1;
    }

    const lecture = await Lecture.create({
      ...req.body,
      order: Number(finalOrder)
    });

    res.status(201).json({ success: true, lecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.json({ success: true, lecture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.id);

    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    res.json({ success: true, message: "Lesson removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderLectures = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "items array is required" });
    }

    await Promise.all(
      items.map((item) =>
        Lecture.findByIdAndUpdate(item.id, { order: Number(item.order) })
      )
    );

    res.json({ success: true, message: "Lessons reordered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};