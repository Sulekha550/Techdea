import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getCourses = async (req, res) => {
  try {
    const { category, search, level, sort } = req.query;
    const filter = { isActive: true };

    // If request is from admin with query ?all=true, return all
    if (req.query.all !== "true") {
      filter.isPublished = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    if (level && level !== "All") {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { branch: { $regex: search, $options: "i" } }
      ];
    }

    let query = Course.find(filter);

    if (sort === "price-low") {
      query = query.sort({ price: 1 });
    } else if (sort === "price-high") {
      query = query.sort({ price: -1 });
    } else if (sort === "rating") {
      query = query.sort({ rating: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const courses = await query.lean();

    // Attach module and lesson counts to each course
    const enriched = await Promise.all(
      courses.map(async (c) => {
        const modules = await Module.find({ course: c._id, isActive: true }).select("_id");
        const moduleIds = modules.map((m) => m._id);
        const lessonCount = await Lecture.countDocuments({
          module: { $in: moduleIds },
          isPublished: true
        });

        return {
          ...c,
          modulesCount: modules.length,
          lessonsCount: lessonCount
        };
      })
    );

    res.json({ success: true, courses: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is ObjectId or slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id.toLowerCase() };

    const course = await Course.findOne(query);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 1. Fetch LMS Curriculum: Modules + Lessons
    const modules = await Module.find({
      course: course._id,
      isActive: true
    }).sort({ order: 1 });

    const curriculum = await Promise.all(
      modules.map(async (mod) => {
        const lectures = await Lecture.find({
          module: mod._id,
          isPublished: true
        }).sort({ order: 1 });

        return {
          ...mod.toObject(),
          lectures
        };
      })
    );

    // 2. Fetch legacy semesters for backward compatibility if any exist
    const semesters = await Semester.find({
      course: course._id,
      isActive: true,
      isPublished: true
    }).sort({ number: 1 });

    res.json({
      success: true,
      course,
      curriculum,
      semesters
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      description,
      branch,
      category,
      duration,
      level,
      price,
      discountPrice,
      image,
      thumbnail,
      instructor,
      whatYouWillLearn,
      requirements,
      faqs,
      featured,
      isPublished
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Course name is required" });
    }

    let slug = slugify(name);
    const sameSlug = await Course.findOne({ slug });
    if (sameSlug) slug = `${slug}-${Date.now()}`;

    const course = await Course.create({
      name,
      slug,
      shortDescription: shortDescription || "",
      description: description || "",
      branch: branch || "Technology",
      category: category || "Development",
      duration: duration || "8 Weeks",
      level: level || "All Levels",
      price: Number(price) || 0,
      discountPrice: Number(discountPrice) || 0,
      image: image || thumbnail || "",
      thumbnail: thumbnail || image || "",
      instructor: instructor || {
        name: "TechDea Academy",
        title: "Senior Technical Lead"
      },
      whatYouWillLearn: Array.isArray(whatYouWillLearn)
        ? whatYouWillLearn
        : typeof whatYouWillLearn === "string"
        ? whatYouWillLearn.split("\n").filter(Boolean)
        : [],
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split("\n").filter(Boolean)
        : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      featured: Boolean(featured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      isActive: true
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (req.body.name && !req.body.slug) {
      req.body.slug = slugify(req.body.name);
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course disabled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};