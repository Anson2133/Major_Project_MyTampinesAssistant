import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./Authentication/pages/LoginPage";
import SelectProfilePage from "./Authentication/pages/SelectProfile";
import ProfilePage from "./Profile/pages/ProfilePage";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout"
import ChatbotLayout from './Chatbot/pages/ChatBotLayout';
import ServicesPage from "./Services/pages/ServicesPage";
import ServiceJourneyPage from "./Services/pages/ServiceJourneyPage";
import DocumentScannerPage from "./Document Scanner/pages/DocumentScannerPage";
import MobileDocumentUploadPage from "./Document Scanner/pages/MobileDocumentUploadPage";
import HelpPage from "./Help/pages/HelpPage";
import AnnouncementsPage from "./Announcements/pages/AnnouncementsPage";
import DirectoryPage from "./Help/pages/DirectoryPage";
import SettingsPage from "./Settings/pages/SettingsPage";
import BookingPage from "./Booking/pages/BookingPage";
import AdminDashboardPage from "./Admin/pages/AdminDashboardPage";
import AdminServiceDiagnosticsPage from "./Admin/pages/AdminServiceDiagnosticsPage";
import AdminPolicyGapsPage from "./Admin/pages/AdminPolicyGapsPage";
import AdminDocumentInsightsPage from "./Admin/pages/AdminDocumentInsightsPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-profile" element={<SelectProfilePage />} />

      {/* Resident app flow */}
      <Route element={<AppLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatbotLayout />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:categoryId" element={<ServiceJourneyPage />} />
        <Route path="/document-scanner" element={<DocumentScannerPage />} />
        <Route
          path="/mobile-document-upload/:scanSessionId"
          element={<MobileDocumentUploadPage />}
        />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Route>

      {/* Admin flow */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/service-diagnostics" element={<AdminServiceDiagnosticsPage />} />
        <Route path="/admin/policy-gaps" element={<AdminPolicyGapsPage />} />
        <Route path="/admin/documents" element={<AdminDocumentInsightsPage />} />
      </Route>
    </Routes>
  );
}

export default App;