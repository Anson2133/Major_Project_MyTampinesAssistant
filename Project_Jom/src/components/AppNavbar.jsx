import { useState } from "react";
import {
  MessageSquare,
  MapPin,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import "./AppNavbar.css";

function AppNavbar({ mode = "resident" }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const isAdmin = mode === "admin";

  const profile = JSON.parse(localStorage.getItem("cachedProfile") || "{}");

  const initials = isAdmin
    ? "AD"
    : profile?.displayName
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
    const language = localStorage.getItem("i18nextLng");

    localStorage.clear();

    if (language) {
      localStorage.setItem("i18nextLng", language);
    }

    navigate("/login");
  };

  return (
    <header className={`app-navbar ${isAdmin ? "app-navbar-admin" : ""}`}>
      <div className="navbar-red-line" />

      <div className="navbar-content">
        <div
          className="navbar-logo"
          onClick={() => navigate(isAdmin ? "/admin" : "/chat")}
        >
          <div className="navbar-logo-icon">
            {isAdmin ? <ShieldCheck size={24} /> : <MessageSquare size={24} />}
            <MapPin size={14} className="navbar-pin" />
          </div>

          <span>
            {isAdmin
              ? "Admin Dashboard"
              : t("nav.appName") || "MyTampines Assistant"}
          </span>
        </div>

        <nav className="navbar-links">
          {isAdmin ? (
            <>
              <NavLink to="/admin">Overview</NavLink>
              <NavLink to="/admin/service-diagnostics">Service Diagnostics</NavLink>
              <NavLink to="/admin/policy-gaps">Policy Gaps</NavLink>
              <NavLink to="/admin/documents">Documents</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/services">{t("nav.services")}</NavLink>
              <NavLink to="/chat">{t("nav.chat")}</NavLink>
              <NavLink to="/booking">{t("nav.booking") || "Booking"}</NavLink>
              <NavLink to="/announcements">
                {t("nav.announcements") || "Announcements"}
              </NavLink>
              <NavLink to="/directory">{t("nav.directory")}</NavLink>
              <NavLink to="/help">{t("nav.help")}</NavLink>
            </>
          )}
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
                <button type="button" onClick={() => changeLanguage("en")}>
                  English
                </button>
                <button type="button" onClick={() => changeLanguage("ms")}>
                  Bahasa Melayu
                </button>
                <button type="button" onClick={() => changeLanguage("zh")}>
                  中文
                </button>
                <button type="button" onClick={() => changeLanguage("ta")}>
                  தமிழ்
                </button>
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
                    <strong>
                      {isAdmin
                        ? "Demo Admin"
                        : profile?.displayName || "Demo Resident"}
                    </strong>
                    <p>
                      {isAdmin
                        ? "Confidential analytics view"
                        : profile?.partialUinfin || "Active profile"}
                    </p>
                  </div>
                </div>

                {!isAdmin && (
                  <>
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
                  </>
                )}

                <button
                  className="dropdown-item logout"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={18} />
                  {t("logout") || "Logout"}
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