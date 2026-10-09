import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";


import ForgotPassword from "./pages/ForgotPassword";

import PatientDashboard from "./pages/Dashboard/PatientDashboard";
import NurseDashboard from "./pages/Dashboard/NurseDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";

import Appointments from "./modules/patient/appointments/Appointments";
import MedicalRecords from "./modules/patient/medicalRecords/MedicalRecords";
import PatientProfile from "./modules/patient/profile/PatientProfile";
import Schedule from "./modules/patient/schedule/Schedule";
import VisitReports from "./modules/patient/visitReports/VisitReports";

import NursePatients from "./modules/nurse/patients/NursePatients";
import NurseAppointments from "./modules/nurse/appointments/NurseAppointments";
import NurseAvailability from "./modules/nurse/availability/NurseAvailability";
import NurseProfile from "./modules/nurse/nurseProfile/NurseProfile";
import PatientCare from "./modules/nurse/patientCare/PatientCare";
import NurseSchedule from "./modules/nurse/schedule/NurseSchedule";
import NurseVisitReports from "./modules/nurse/visitReport/NurseVisitReport";

import ManageNurses from "./modules/admin/nurses/ManageNurses";
import ManagePatients from "./modules/admin/patients/ManagePatients";
import AdminAppointments from "./modules/admin/appointments/AdminAppointments";
import AdminVisits from "./modules/admin/visits/AdminVisits";
import AdminVisitReports from "./modules/admin/visitReport/AdminVisitReports";
import AdminAvailability from "./modules/admin/availability/AdminAvailability";

import "./App.css";
import "./CareNestTheme.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/role-selection"
          element={<Navigate to="/signup" replace />}
        />

        <Route
          path="/services"
          element={<Home />}
        />

        <Route
          path="/services/:serviceId"
          element={<Home />}
        />

        <Route
          path="/dashboard/patient"
          element={<PatientDashboard />}
        />

        <Route
          path="/dashboard/nurse"
          element={<NurseDashboard />}
        />

        <Route
          path="/dashboard/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/patient/appointments"
          element={<Appointments />}
        />

        <Route
          path="/patient/medical-records"
          element={<MedicalRecords />}
        />

        <Route
          path="/patient/profile"
          element={<PatientProfile />}
        />

        <Route
          path="/patient/schedule"
          element={<Schedule />}
        />

        <Route
          path="/patient/visit-reports"
          element={<VisitReports />}
        />

        <Route
          path="/nurse/patients"
          element={<NursePatients />}
        />

        <Route
          path="/nurse/appointments"
          element={<NurseAppointments />}
        />

        <Route
          path="/nurse/schedule"
          element={<NurseSchedule />}
        />

        <Route
          path="/nurse/availability"
          element={<NurseAvailability />}
        />

        <Route
          path="/nurse/patient-care"
          element={<PatientCare />}
        />

        <Route
          path="/nurse/visit-reports"
          element={<NurseVisitReports />}
        />

        <Route
          path="/nurse/profile"
          element={<NurseProfile />}
        />

        <Route
          path="/admin/nurses"
          element={
            <AdminProtectedRoute>
              <ManageNurses />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/patients"
          element={
            <AdminProtectedRoute>
              <ManagePatients />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <AdminProtectedRoute>
              <AdminAppointments />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/visits"
          element={
            <AdminProtectedRoute>
              <AdminVisits />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/visit-reports"
          element={
            <AdminProtectedRoute>
              <AdminVisitReports />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/availability"
          element={
            <AdminProtectedRoute>
              <AdminAvailability />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <div className="not-found">
              <div className="not-found-card">
                <div className="not-found-number">
                  404
                </div>

                <h1>
                  Page Not Found
                </h1>

                <p>
                  The page you are looking for does not exist.
                </p>

                <a href="/">
                  Back to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;