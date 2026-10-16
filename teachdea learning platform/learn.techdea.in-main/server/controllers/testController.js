import Test from "../models/Test.js";
import QuizAttempt from "../models/QuizAttempt.js";

export const getTests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.all !== "true") {
      filter.isPublished = true;
    }

    if (req.query.course) filter.course = req.query.course;
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.module) filter.module = req.query.module;

    const tests = await Test.find(filter)
      .select("-questions.answer -questions.explanation")
      .populate("course", "name")
      .populate("subject", "name code")
      .sort({ createdAt: -1 });

    res.json({ success: true, tests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .select("-questions.answer -questions.explanation")
      .populate("course", "name")
      .populate("subject", "name code");

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestForAdmin = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("course", "name")
      .populate("subject", "name code");

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, test });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    res.json({ success: true, message: "Test deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTestAttempt = async (req, res) => {
  try {
    const { id: testId } = req.params;
    const { answers = [], timeSpentSeconds = 0 } = req.body;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Backend grading to prevent frontend score manipulation
    let score = 0;
    let totalMarks = 0;
    const gradedAnswers = [];

    // Map submitted answers by question ID
    const submittedMap = new Map();
    answers.forEach((a) => {
      submittedMap.set(String(a.questionId), Number(a.selectedOption));
    });

    test.questions.forEach((q) => {
      const qMarks = q.marks || 1;
      totalMarks += qMarks;

      const qIdStr = String(q._id);
      const studentSelected = submittedMap.has(qIdStr)
        ? submittedMap.get(qIdStr)
        : -1;

      const isCorrect = studentSelected === q.answer;
      const marksObtained = isCorrect ? qMarks : 0;
      score += marksObtained;

      gradedAnswers.push({
        questionId: q._id,
        selectedOption: studentSelected,
        isCorrect,
        marksObtained
      });
    });

    const percentage =
      totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const passed = percentage >= (test.passingPercentage || 50);

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      test: test._id,
      course: test.course || null,
      answers: gradedAnswers,
      score,
      totalMarks,
      percentage,
      passed,
      timeSpentSeconds: Number(timeSpentSeconds) || 0
    });

    // Return detailed feedback with correct answers now that it's submitted
    const questionsWithFeedback = test.questions.map((q) => {
      const qIdStr = String(q._id);
      const studentSelected = submittedMap.has(qIdStr)
        ? submittedMap.get(qIdStr)
        : -1;

      return {
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        studentSelected,
        isCorrect: studentSelected === q.answer,
        marks: q.marks || 1,
        explanation: q.explanation || ""
      };
    });

    res.json({
      success: true,
      message: passed ? "Congratulations, you passed the quiz!" : "Quiz submitted. Keep practicing!",
      attempt: {
        id: attempt._id,
        score,
        totalMarks,
        percentage,
        passed,
        passingPercentage: test.passingPercentage || 50,
        timeSpentSeconds,
        submittedAt: attempt.submittedAt
      },
      review: questionsWithFeedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const filter = { student: req.user._id };
    if (req.query.testId) filter.test = req.query.testId;

    const attempts = await QuizAttempt.find(filter)
      .populate("test", "title durationMinutes passingPercentage")
      .populate("course", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};