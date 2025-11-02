import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/ClassAttendance';
import Grades from './pages/GradeEntry';
import PrivateRoute from './components/PrivateRoute';
import AdminUsers from './pages/AdminUsers';
import AcademicYears from './pages/AcademicYears';
import Terms from './pages/Terms';
import SchoolClasses from './pages/SchoolClasses';
import Subjects from './pages/Subjects';
import ClassSubjects from './pages/ClassSubjects';
import Assessments from './pages/Assessments';
import BehaviourIncidents from './pages/BehaviourIncidents';
import Messages from './pages/Messages';
import MessageThreads from './pages/MessageThreads';
import Notifications from './pages/Notifications';
import TermReports from './pages/TermReports';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          {/* Make Login the landing (root) route */}
          <Route path="/" element={<Login />} />

          {/* Protected dashboard route moved to /dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/grades"
            element={
              <PrivateRoute>
                <Grades />
              </PrivateRoute>
            }
          />

          {/* Admin pages */}
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/academic-years"
            element={
              <PrivateRoute>
                <AcademicYears />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/terms"
            element={
              <PrivateRoute>
                <Terms />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <PrivateRoute>
                <SchoolClasses />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <PrivateRoute>
                <Subjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/class-subjects"
            element={
              <PrivateRoute>
                <ClassSubjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/assessments"
            element={
              <PrivateRoute>
                <Assessments />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/behaviour"
            element={
              <PrivateRoute>
                <BehaviourIncidents />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/threads"
            element={
              <PrivateRoute>
                <MessageThreads />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute>
                <TermReports />
              </PrivateRoute>
            }
          />

          {/* Optional fallback: redirect to landing (login) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
