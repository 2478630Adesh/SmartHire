import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TemplateGallery from './pages/TemplateGallery';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSChecker from './pages/ATSChecker';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import HRDashboard from './pages/HRDashboard';
import HRPostJob from './pages/HRPostJob';
import HRApplicants from './pages/HRApplicants';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();
  // Hide footer on builder (it has its own layout)
  const hideFooter = location.pathname.startsWith('/builder/');
  // Hide navbar/footer on builder for a focused editing experience
  const hideChrome = location.pathname.startsWith('/builder/');

  return (
    <>
      {!hideChrome && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/templates" element={<TemplateGallery />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/ats-checker" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/builder/:id" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />

          {/* HR */}
          <Route path="/hr/dashboard" element={<ProtectedRoute hrOnly><HRDashboard /></ProtectedRoute>} />
          <Route path="/hr/post-job" element={<ProtectedRoute hrOnly><HRPostJob /></ProtectedRoute>} />
          <Route path="/hr/job/:jobId/applicants" element={<ProtectedRoute hrOnly><HRApplicants /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
