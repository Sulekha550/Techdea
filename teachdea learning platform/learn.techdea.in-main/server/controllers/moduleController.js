import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";

export const getModules = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.course) filter.course = req.query.course;
    if (req.query.subject) filter.subject = req.query.subject;

    const modules = await Module.find(filter)
      .populate("course", "name")
      .sort({ order: 1 });

    // Attach lesson counts
    const enriched = await Promise.all(
      modules.map(async (m) => {
        const count = await Lecture.countDocuments({ module: m._id, isPublished: true });
        return { ...m.toObject(), lectureCount: count };
      })
    );

    res.json({ success: true, modules: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createModule = async (req, res) => {
  try {
    const { course, subject, title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Module title is required" });
    }

    if (!course && !subject) {
      return res.status(400).json({
        success: false,
        message: "Module must belong to a Course or Subject"
      });
    }

    const highestOrder = await Module.findOne({
      ...(course ? { course } : { subject })
    }).sort({ order: -1 });

    const newOrder =
      order !== undefined ? Number(order) : (highestOrder?.order || 0) + 1;

    const moduleDoc = await Module.create({
      course: course || null,
      subject: subject || null,
      title: title.trim(),
      description: description || "",
      order: newOrder,
      isActive: true
    });

    res.status(201).json({ success: true, module: moduleDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!moduleDoc) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.json({ success: true, module: moduleDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!moduleDoc) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.json({ success: true, message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderModules = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, order }]
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "items array is required" });
    }

    await Promise.all(
      items.map((item) =>
        Module.findByIdAndUpdate(item.id, { order: Number(item.order) })
      )
    );

    res.json({ success: true, message: "Modules reordered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
