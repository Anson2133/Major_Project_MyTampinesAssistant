import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AppNavbar from "../components/AppNavbar";
import "../App.css";

const DEFAULT_SETTINGS = {
  textSize: "normal",
  simpleView: false,
  highContrast: false,
  reduceMotion: false,
};

function readDisplaySettings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("mytampinesDisplaySettings") || "{}"
    );

    return {
      ...DEFAULT_SETTINGS,
      ...saved,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function AppLayout() {
  const [settings, setSettings] = useState(readDisplaySettings);

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(readDisplaySettings());
    };

    window.addEventListener(
      "mytampines-settings-changed",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "mytampines-settings-changed",
        handleSettingsChange
      );
    };
  }, []);

  const appClassName = [
    "app-wrapper",
    settings.textSize === "large" ? "text-large" : "",
    settings.textSize === "extraLarge" ? "text-extra-large" : "",
    settings.simpleView ? "simple-view" : "",
    settings.highContrast ? "high-contrast" : "",
    settings.reduceMotion ? "reduce-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClassName}>
      <AppNavbar />
      <Outlet />
    </div>
  );
}

export default AppLayout;