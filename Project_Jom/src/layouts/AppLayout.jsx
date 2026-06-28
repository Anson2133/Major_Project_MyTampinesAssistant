import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import AppNavbar from "../components/AppNavbar";
import "../App.css";

const DEFAULT_SETTINGS = {
  textSize: "normal",
  guidedMode: false,
  reduceMotion: false,
};

function readAppSettings() {
  try {
    const newSettings = JSON.parse(
      localStorage.getItem("mytampinesAppSettings") || "{}"
    );

    const oldDisplaySettings = JSON.parse(
      localStorage.getItem("mytampinesDisplaySettings") || "{}"
    );

    return {
      ...DEFAULT_SETTINGS,
      textSize:
        newSettings.textSize ||
        oldDisplaySettings.textSize ||
        DEFAULT_SETTINGS.textSize,

      guidedMode:
        newSettings.guidedMode ??
        oldDisplaySettings.simpleView ??
        DEFAULT_SETTINGS.guidedMode,

      reduceMotion:
        newSettings.reduceMotion ??
        oldDisplaySettings.reduceMotion ??
        DEFAULT_SETTINGS.reduceMotion,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function AppLayout() {
  const [settings, setSettings] = useState(readAppSettings);

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings(readAppSettings());
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
    settings.guidedMode ? "guided-mode" : "",
    settings.reduceMotion ? "reduce-motion" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appClassName}>
      <AppNavbar mode="resident" />
      <Outlet />
    </div>
  );
}

export default AppLayout;