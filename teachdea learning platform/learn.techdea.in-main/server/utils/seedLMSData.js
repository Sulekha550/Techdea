import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Lecture from "../models/Lecture.js";
import Test from "../models/Test.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for LMS Seeding...");

    // 1. Ensure Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@techdea.in").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "ChangeThisAdminPassword123!";
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin = await User.create({
        name: process.env.ADMIN_NAME || "TechDea Administrator",
        email: adminEmail,
        password: hashedPassword,
        phone: "+91 9876543210",
        role: "admin",
        isActive: true
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      admin.role = "admin";
      await admin.save();
      console.log(`Admin user verified: ${adminEmail}`);
    }

    // 2. Ensure Demo Student
    const studentEmail = "student@techdea.in";
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      const studentHash = await bcrypt.hash("Student123!", 12);
      student = await User.create({
        name: "Rahul Sharma",
        email: studentEmail,
        password: studentHash,
        phone: "+91 9876501234",
        role: "student",
        isActive: true
      });
      console.log(`Demo Student created: ${studentEmail} (Password: Student123!)`);
    }

    // 3. Check if courses already exist
    const existingCoursesCount = await Course.countDocuments();
    if (existingCoursesCount > 0) {
      console.log(`Courses already exist (${existingCoursesCount} found). Skipping course seeding to preserve data.`);
      return;
    }

    console.log("Seeding primary TechDea LMS courses...");

    // Course 1: Full-Stack MERN
    const mernCourse = await Course.create({
      name: "Full-Stack Web Development with MERN & Next.js",
      slug: "full-stack-web-development-mern",
      shortDescription:
        "Master modern full-stack web development from fundamentals to enterprise architectures with React, Node.js, Express, and MongoDB.",
      description:
        "A comprehensive industry-driven program designed by TechDea engineers. Build scalable web applications, implement production authentication, manage distributed databases, and deploy full-stack apps to cloud infrastructure.",
      branch: "Software Engineering",
      category: "Full Stack Development",
      duration: "12 Weeks",
      level: "Intermediate",
      price: 0, // Free preview / showcase course
      discountPrice: 0,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
      instructor: {
        name: "Er. Deepak Kumar",
        title: "Principal Software Architect at TechDea",
        bio: "Over 14 years of building high-scale distributed systems and mentoring engineering teams.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
      },
      rating: 4.9,
      ratingCount: 88,
      studentsCount: 1420,
      whatYouWillLearn: [
        "Architect scalable RESTful APIs with Node.js & Express 5",
        "Design production MongoDB schemas with Mongoose indexes",
        "Build reactive, responsive UIs with modern React 19 & Tailwind/CSS",
        "Implement robust JWT authentication and role-based access control",
        "State management, custom hooks, and performance tuning",
        "CI/CD pipelines, containerization, and production deployment"
      ],
      requirements: [
        "Basic understanding of HTML, CSS, and modern JavaScript (ES6+)",
        "A computer with Node.js installed and an active internet connection",
        "Curiosity and commitment to build real-world software products"
      ],
      faqs: [
        {
          question: "Is this course beginner-friendly?",
          answer: "Yes, it starts with foundational JavaScript and server concepts before advancing to enterprise patterns."
        },
        {
          question: "Will I receive a verified certificate upon completion?",
          answer: "Yes! Completing 100% of lectures and passing the course quiz issues a verifiable TechDea Certificate."
        }
      ],
      featured: true,
      isActive: true,
      isPublished: true
    });

    // Modules & Lessons for MERN Course
    const mernMod1 = await Module.create({
      course: mernCourse._id,
      title: "Module 1: Modern JavaScript & Frontend Foundations",
      description: "Deep dive into ES6+, asynchronous programming, and React architecture.",
      order: 1,
      isActive: true
    });

    const mernMod2 = await Module.create({
      course: mernCourse._id,
      title: "Module 2: Server Architecture & MongoDB",
      description: "Building production Express APIs, data modeling, and security practices.",
      order: 2,
      isActive: true
    });

    // Lessons for Mod 1
    await Lecture.create({
      module: mernMod1._id,
      title: "01. Introduction to Modern Full-Stack Architecture",
      description: "Overview of client-server communication, stateless APIs, and modern SPA design.",
      contentType: "video",
      videoId: "M576WGiDBdQ", // Clean educational YouTube video
      duration: "18 min",
      order: 1,
      isPreview: true,
      isPublished: true,
      noteUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps",
      resources: [
        { title: "Course Roadmap PDF", url: "https://techdea.in/resources/roadmap.pdf", type: "pdf" },
        { title: "Architecture Diagram", url: "https://techdea.in/resources/architecture.png", type: "image" }
      ]
    });

    await Lecture.create({
      module: mernMod1._id,
      title: "02. React 19 State Management & Custom Hooks",
      description: "Master React state, effects, hooks, and clean component composition.",
      contentType: "video",
      videoId: "bMknfKXIFA8",
      duration: "24 min",
      order: 2,
      isPreview: false,
      isPublished: true,
      noteUrl: "https://react.dev/reference/react",
      resources: [
        { title: "Hooks Cheat Sheet", url: "https://react.dev", type: "link" }
      ]
    });

    // Lessons for Mod 2
    await Lecture.create({
      module: mernMod2._id,
      title: "03. Building Secure Express REST APIs",
      description: "Middleware architecture, token authentication, and centralized error handling.",
      contentType: "video",
      videoId: "Oe421EPjeBE",
      duration: "28 min",
      order: 1,
      isPreview: false,
      isPublished: true,
      resources: [
        { title: "Express Documentation", url: "https://expressjs.com", type: "link" }
      ]
    });

    await Lecture.create({
      module: mernMod2._id,
      title: "04. MongoDB Data Modeling with Mongoose",
      description: "Designing relationships, compound indexes, aggregation pipelines, and transactions.",
      contentType: "text",
      content: `# MongoDB & Mongoose Schema Design
Data modeling in document databases requires designing schemas according to your application query access patterns.

## Key Principles:
1. **Embedding vs Referencing**:
   - Embed child documents when data is always read together and has a bounded size (1:Few).
   - Reference ObjectIds when data grows indefinitely (1:Many or Many:Many).
2. **Indexing**: Always index frequently queried fields and sorting keys.
3. **Validation**: Use schema validators to guarantee data integrity at the database layer.`,
      duration: "20 min",
      order: 2,
      isPreview: false,
      isPublished: true
    });

    // Create Course Quiz
    await Test.create({
      course: mernCourse._id,
      module: mernMod1._id,
      title: "Full-Stack Fundamentals Assessment",
      description: "Evaluate your understanding of React, Express, and database architecture.",
      durationMinutes: 10,
      passingPercentage: 60,
      isPublished: true,
      questions: [
        {
          question: "Which HTTP status code is most appropriate for creating a new resource?",
          options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
          answer: 1,
          marks: 1,
          explanation: "201 Created signifies that the request succeeded and led to resource creation."
        },
        {
          question: "Where should sensitive tokens like JWT_SECRET and database passwords reside?",
          options: [
            "In frontend source code",
            "In localStorage",
            "In backend environment variables (.env)",
            "In the URL query string"
          ],
          answer: 2,
          marks: 1,
          explanation: "Sensitive secrets must always be kept on the backend in protected environment variables."
        },
        {
          question: "In React, what is the primary benefit of custom hooks?",
          options: [
            "They allow writing class components inside functions",
            "They share stateful logic between components without duplicating code",
            "They bypass the virtual DOM",
            "They replace CSS stylesheets"
          ],
          answer: 1,
          marks: 1,
          explanation: "Custom hooks extract and encapsulate reusable stateful logic."
        }
      ]
    });

    // Course 2: Python & Data Science
    await Course.create({
      name: "Python for Data Science, Analytics & Machine Learning",
      slug: "python-data-science-machine-learning",
      shortDescription:
        "From data wrangling with Pandas and NumPy to predictive modeling and data visualization.",
      description:
        "Build a rock-solid data engineering and analysis foundation with real-world datasets, statistical analysis, and machine learning workflows.",
      branch: "Data Science",
      category: "Data & AI",
      duration: "10 Weeks",
      level: "Beginner",
      price: 1499,
      discountPrice: 999,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
      instructor: {
        name: "Pooja Verma",
        title: "Senior Data Scientist",
        bio: "Specializing in computational statistics and applied machine learning.",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
      },
      rating: 4.8,
      ratingCount: 64,
      studentsCount: 980,
      whatYouWillLearn: [
        "NumPy, Pandas, and data wrangling techniques",
        "Exploratory Data Analysis (EDA) & Matplotlib/Seaborn visualizations",
        "Supervised and unsupervised learning algorithms with Scikit-Learn",
        "Model evaluation, hyperparameter tuning, and deployment"
      ],
      requirements: [
        "Basic computer literacy",
        "High-school mathematics (basic statistics)"
      ],
      featured: true,
      isActive: true,
      isPublished: true
    });

    // Course 3: Cloud & DevOps
    await Course.create({
      name: "Cloud Engineering & DevOps with Docker and Kubernetes",
      slug: "cloud-engineering-devops-docker-kubernetes",
      shortDescription:
        "Master containerization, CI/CD automation, cloud infrastructure, and microservices orchestration.",
      description:
        "Learn how top tech organizations deploy and maintain resilient software at global scale with Docker, Kubernetes, Linux, and GitHub Actions.",
      branch: "Cloud & DevOps",
      category: "DevOps",
      duration: "8 Weeks",
      level: "Advanced",
      price: 2499,
      discountPrice: 1499,
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop",
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop",
      instructor: {
        name: "Ankit Trivedi",
        title: "Cloud Infrastructure Architect",
        bio: "Kubernetes certified engineer with extensive cloud migration experience.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
      },
      rating: 4.9,
      ratingCount: 42,
      studentsCount: 650,
      whatYouWillLearn: [
        "Containerization with Docker & Docker Compose",
        "Kubernetes pods, deployments, services, and ingresses",
        "Automated CI/CD pipelines with GitHub Actions",
        "Infrastructure as Code and cloud security practices"
      ],
      requirements: [
        "Familiarity with command line & basic networking"
      ],
      featured: true,
      isActive: true,
      isPublished: true
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedData();
