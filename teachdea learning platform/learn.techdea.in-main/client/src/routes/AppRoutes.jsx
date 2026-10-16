import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

import Home from "../pages/public/Home.jsx";
import Courses from "../pages/public/Courses.jsx";
import CourseDetails from "../pages/public/CourseDetails.jsx";
import About from "../pages/public/About.jsx";
import Services from "../pages/public/Services.jsx";

import Training from "../pages/public/Training.jsx";
import Team from "../pages/public/Team.jsx";
import Contact from "../pages/public/Contact.jsx";
import CertificateVerify from "../pages/public/CertificateVerify.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

import StudentLayout from "../components/layout/StudentLayout.jsx";
import Dashboard from "../pages/student/Dashboard.jsx";
import MyCourses from "../pages/student/MyCourses.jsx";
import LearnCourse from "../pages/student/LearnCourse.jsx";
import Subject from "../pages/student/Subject.jsx";
import Lecture from "../pages/student/Lecture.jsx";
import Notes from "../pages/student/Notes.jsx";
import StudentNotesHub from "../pages/student/NotesHub.jsx";
import Tests from "../pages/student/Tests.jsx";
import Progress from "../pages/student/Progress.jsx";
import Profile from "../pages/student/Profile.jsx";
import Certificates from "../pages/student/Certificates.jsx";

import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import Students from "../pages/admin/Students.jsx";
import AdminCourses from "../pages/admin/Courses.jsx";
import Semesters from "../pages/admin/Semesters.jsx";
import Subjects from "../pages/admin/Subjects.jsx";
import Modules from "../pages/admin/Modules.jsx";
import Lectures from "../pages/admin/Lectures.jsx";
import AdminNotes from "../pages/admin/Notes.jsx";
import Enrollments from "../pages/admin/Enrollments.jsx";
import Payments from "../pages/admin/Payments.jsx";
import AdminTests from "../pages/admin/Tests.jsx";
import Settings from "../pages/admin/Settings.jsx";
import AdminCertificates from "../pages/admin/AdminCertificates.jsx";
import ContactMessages from "../pages/admin/ContactMessages.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
       
        <Route path="/training" element={<Training />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/verify/:certificateId" element={<CertificateVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/course/:semesterId" element={<LearnCourse />} />
          <Route path="/learn/subject/:subjectId" element={<Subject />} />
          <Route path="/learn/lecture/:lectureId" element={<Lecture />} />
          <Route path="/notes" element={<StudentNotesHub />} />
          <Route path="/notes/:subjectId" element={<Notes />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/:subjectId" element={<Tests />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/semesters" element={<Semesters />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/modules" element={<Modules />} />
          <Route path="/admin/lectures" element={<Lectures />} />
          <Route path="/admin/notes" element={<AdminNotes />} />
          <Route path="/admin/enrollments" element={<Enrollments />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/tests" element={<AdminTests />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/contact" element={<ContactMessages />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
