import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./Authentication/pages/LoginPage";
import AuthPage from "./Authentication/pages/AuthPage";
import SelectProfilePage from "./Authentication/pages/SelectProfile";
import ProfilePage from "./Profile/pages/ProfilePage";
import AppLayout from "./layouts/AppLayout";
import ChatbotLayout from './Chatbot/pages/ChatBotLayout';
import ServicesPage from "./Services/pages/ServicesPage";
import ServiceJourneyPage from "./Services/pages/ServiceJourneyPage";
import DocumentScannerPage from "./Document Scanner/pages/DocumentScannerPage";
import MobileDocumentUploadPage from "./Document Scanner/pages/MobileDocumentUploadPage";
import HelpPage from "./Help/pages/HelpPage";
import LifeSituationsPage from "./lifeWizard/pages/LifeSituationsPage";
import AnnouncementsPage from "./Announcements/pages/AnnouncementsPage";
import DirectoryPage from "./Help/pages/DirectoryPage";
import SettingsPage from "./Settings/pages/SettingsPage";
import BookingPage from "./Booking/pages/BookingPage";
import OpportunityPage from "./Opportunity/pages/OpportunityConnectPage";
import OpportunityInboxPage from "./Opportunity/pages/OpportunityInboxPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/select-profile" element={<SelectProfilePage />} />

      <Route element={<AppLayout />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatbotLayout />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route
          path="/services/:categoryId"
          element={<ServiceJourneyPage />}
        />
        <Route path="/life-situations" element={<LifeSituationsPage />} />
        <Route path="/document-scanner" element={<DocumentScannerPage />} />
        <Route path="/mobile-document-upload/:scanSessionId" element={<MobileDocumentUploadPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/opportunity-connect" element={<OpportunityPage />} />
        <Route path="/opportunity-connect/inbox" element={<OpportunityInboxPage />} />
      </Route>

    </Routes>
  );
}

export default App;