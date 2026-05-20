import { useState } from "react";
import {
  MessageSquare,
  MapPin,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Settings,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import "./AppNavbar.css";

function AppNavbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const profile = JSON.parse(localStorage.getItem("cachedProfile") || "{}");

  const initials = profile?.displayName
    ? profile.displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "U";

  const currentLanguage = i18n.language?.split("-")[0] || "en";

  const languageLabels = {
    en: "EN",
    ms: "MS",
    zh: "中文",
    ta: "தமிழ்",
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    setLanguageOpen(false);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="app-navbar">
      <div className="navbar-red-line" />

      <div className="navbar-content">
        <div className="navbar-logo" onClick={() => navigate("/chat")}>
          <div className="navbar-logo-icon">
            <MessageSquare size={24} />
            <MapPin size={14} className="navbar-pin" />
          </div>
          <span>{t("nav.appName")}</span>
        </div>

        <nav className="navbar-links">
          <NavLink to="/services">{t("nav.services")}</NavLink>

          <NavLink to="/chat">{t("nav.chat")}</NavLink>

          <NavLink to="/booking">{t("nav.booking") || "Booking"}</NavLink>

          <NavLink to="/announcements">
            {t("nav.announcements") || "Announcements"}
          </NavLink>

          <NavLink to="/directory">{t("nav.directory")}</NavLink>

          <NavLink to="/help">{t("nav.help")}</NavLink>
        </nav>

        <div className="navbar-actions">
          <div className="language-wrapper">
            <button
              className="language-pill"
              type="button"
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <Globe size={20} />
              <span>{languageLabels[currentLanguage] || "EN"}</span>
              <ChevronDown size={16} />
            </button>

            {languageOpen && (
              <div className="language-dropdown">
                <button onClick={() => changeLanguage("en")}>English</button>
                <button onClick={() => changeLanguage("ms")}>
                  Bahasa Melayu
                </button>
                <button onClick={() => changeLanguage("zh")}>中文</button>
                <button onClick={() => changeLanguage("ta")}>தமிழ்</button>
              </div>
            )}
          </div>

          <div className="profile-menu-wrapper">
            <button
              className="profile-menu-button"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="navbar-avatar">{initials}</div>
              <ChevronDown size={18} />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="dropdown-avatar">{initials}</div>
                  <div>
                    <strong>{profile?.displayName || "Demo Resident"}</strong>
                    <p>{profile?.partialUinfin || "Active profile"}</p>
                  </div>
                </div>

                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={18} />
                  {t("common.editProfile")}
                </button>

                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings size={18} />
                  Settings
                </button>

                <button
                  className="dropdown-item logout"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppNavbar;