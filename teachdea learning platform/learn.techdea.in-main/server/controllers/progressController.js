import Progress from "../models/Progress.js";
import Lecture from "../models/Lecture.js";
import Module from "../models/Module.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const toggleLessonProgress = async (req, res) => {
  try {
    const { lectureId, courseId, completed, lastPositionSeconds } = req.body;

    if (!lectureId) {
      return res.status(400).json({ success: false, message: "lectureId is required" });
    }

    const lecture = await Lecture.findById(lectureId).populate("module");
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const determinedCourseId =
      courseId || lecture.module?.course || null;

    let progress = await Progress.findOne({
      student: req.user._id,
      lecture: lectureId
    });

    const isCompleted =
      completed !== undefined ? Boolean(completed) : progress ? !progress.completed : true;

    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        lecture: lectureId,
        course: determinedCourseId,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
        lastPositionSeconds: lastPositionSeconds || 0
      });
    } else {
      progress.completed = isCompleted;
      progress.completedAt = isCompleted ? (progress.completedAt || new Date()) : null;
      if (lastPositionSeconds !== undefined) {
        progress.lastPositionSeconds = lastPositionSeconds;
      }
      if (determinedCourseId && !progress.course) {
        progress.course = determinedCourseId;
      }
      await progress.save();
    }

    res.json({
      success: true,
      message: progress.completed ? "Lesson marked as complete" : "Lesson marked as incomplete",
      progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find modules of this course
    const modules = await Module.find({ course: courseId, isActive: true }).select("_id");
    const moduleIds = modules.map((m) => m._id);

    // Find all published lectures across these modules
    const publishedLectures = await Lecture.find({
      module: { $in: moduleIds },
      isPublished: true
    }).select("_id title");

    const totalLessons = publishedLectures.length;
    const lectureIds = publishedLectures.map((l) => l._id);

    // Find completed progress records for current student
    const completedRecords = await Progress.find({
      student: req.user._id,
      lecture: { $in: lectureIds },
      completed: true
    }).select("lecture completedAt");

    const completedLessonIds = completedRecords.map((r) => r.lecture.toString());
    const completedCount = completedLessonIds.length;
    const percentage =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.json({
      success: true,
      data: {
        courseId,
        totalLessons,
        completedCount,
        percentage,
        isCompleted: percentage === 100 && totalLessons > 0,
        completedLessonIds
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgressSummary = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: { $in: ["active", "completed"] }
    }).populate("course");

    const courseSummaries = [];
    let totalCompletedLessonsOverall = 0;
    let totalLessonsOverall = 0;
    let fullyCompletedCourses = 0;

    for (const enrollment of enrollments) {
      if (!enrollment.course) continue;
      const cId = enrollment.course._id;

      const modules = await Module.find({ course: cId, isActive: true }).select("_id");
      const moduleIds = modules.map((m) => m._id);

      const lectures = await Lecture.find({
        module: { $in: moduleIds },
        isPublished: true
      }).select("_id");

      const totalL = lectures.length;
      const lIds = lectures.map((l) => l._id);

      const completed = await Progress.countDocuments({
        student: req.user._id,
        lecture: { $in: lIds },
        completed: true
      });

      const pct = totalL > 0 ? Math.round((completed / totalL) * 100) : 0;
      if (pct === 100 && totalL > 0) fullyCompletedCourses++;

      totalLessonsOverall += totalL;
      totalCompletedLessonsOverall += completed;

      courseSummaries.push({
        course: enrollment.course,
        totalLessons: totalL,
        completedLessons: completed,
        percentage: pct,
        isCompleted: pct === 100 && totalL > 0
      });
    }

    const overallPercentage =
      totalLessonsOverall > 0
        ? Math.round((totalCompletedLessonsOverall / totalLessonsOverall) * 100)
        : 0;

    res.json({
      success: true,
      summary: {
        enrolledCount: enrollments.length,
        fullyCompletedCourses,
        totalLessonsOverall,
        totalCompletedLessonsOverall,
        overallPercentage,
        courses: courseSummaries
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
