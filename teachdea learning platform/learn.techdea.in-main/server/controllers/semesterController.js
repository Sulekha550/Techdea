import Semester from "../models/Semester.js";

export const getSemesters = async (req, res) => {
  const filter = { isActive: true, isPublished: true };

  if (req.query.course) filter.course = req.query.course;

  const semesters = await Semester.find(filter)
    .populate("course", "name branch")
    .sort({ number: 1 });

  res.json({ success: true, semesters });
};

export const getSemester = async (req, res) => {
  const semester = await Semester.findById(req.params.id).populate("course", "name branch");

  if (!semester) {
    return res.status(404).json({ success: false, message: "Semester not found" });
  }

  res.json({ success: true, semester });
};

export const createSemester = async (req, res) => {
  const semester = await Semester.create(req.body);
  res.status(201).json({ success: true, semester });
};

export const updateSemester = async (req, res) => {
  const semester = await Semester.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!semester) {
    return res.status(404).json({ success: false, message: "Semester not found" });
  }

  res.json({ success: true, semester });
};

export const deleteSemester = async (req, res) => {
  const semester = await Semester.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!semester) {
    return res.status(404).json({ success: false, message: "Semester not found" });
  }

  res.json({ success: true, message: "Semester disabled" });
};