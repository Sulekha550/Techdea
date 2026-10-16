import Subject from "../models/Subject.js";
import Module from "../models/Module.js";

export const getSubjects = async (req, res) => {
  const filter = { isActive: true };
  if (req.query.semester) filter.semester = req.query.semester;

  const subjects = await Subject.find(filter)
    .populate("semester", "number title")
    .sort({ order: 1, name: 1 });

  res.json({ success: true, subjects });
};

export const getSubject = async (req, res) => {
  const subject = await Subject.findById(req.params.id)
    .populate("semester", "number title");

  if (!subject) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  const modules = await Module.find({
    subject: subject._id,
    isActive: true
  }).sort({ order: 1 });

  res.json({ success: true, subject, modules });
};

export const createSubject = async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, subject });
};

export const updateSubject = async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!subject) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  res.json({ success: true, subject });
};

export const deleteSubject = async (req, res) => {
  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!subject) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  res.json({ success: true, message: "Subject disabled" });
};