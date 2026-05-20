import { useEffect, useState } from "react";
import {
  Eye,
  LayoutList,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  TextCursorInput,
} from "lucide-react";

import SettingCard, {
  SettingOptionButton,
  SettingToggle,
} from "../components/SettingCard";

import "../settings.css";

const DEFAULT_SETTINGS = {
  textSize: "normal",
  simpleView: false,
  highContrast: false,
  reduceMotion: false,
};

function readSettings() {
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

function saveSettings(nextSettings) {
  localStorage.setItem(
    "mytampinesDisplaySettings",
    JSON.stringify(nextSettings)
  );

  window.dispatchEvent(new Event("mytampines-settings-changed"));
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <main className="settings-page">
      <section className="settings-hero">
        <div>
          <span className="settings-eyebrow">Display Settings</span>
          <h1>Make the app easier to read and use</h1>
          <p>
            Adjust text size, page layout, contrast, and motion. These settings
            are saved on this browser and apply across MyTampines Assistant.
          </p>
        </div>

        <div className="settings-hero-card">
          <Sparkles size={28} />
          <div>
            <strong>Recommended for residents</strong>
            <p>
              Try Large Text and Simple View if you want clearer cards, bigger
              buttons, and less visual clutter.
            </p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Reading</span>
          <h2>Text and readability</h2>
          <p>Choose how large text should appear across the app.</p>
        </div>

        <SettingCard
          icon={TextCursorInput}
          title="Text Size"
          description="Increase text size for pages, cards, buttons, forms, FAQ answers, and chatbot content."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.textSize === "normal"}
              onClick={() => updateSetting("textSize", "normal")}
            >
              Normal
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.textSize === "large"}
              onClick={() => updateSetting("textSize", "large")}
            >
              Large
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.textSize === "extraLarge"}
              onClick={() => updateSetting("textSize", "extraLarge")}
            >
              Extra Large
            </SettingOptionButton>
          </div>
        </SettingCard>

        <SettingCard
          icon={Eye}
          title="High Contrast"
          description="Makes text, borders, and buttons clearer while keeping the Tampines red theme."
        >
          <SettingToggle
            checked={settings.highContrast}
            onChange={(value) => updateSetting("highContrast", value)}
          />
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Layout</span>
          <h2>Simpler display</h2>
          <p>Make pages feel less crowded and easier to scan.</p>
        </div>

        <SettingCard
          icon={LayoutList}
          title="Simple View"
          description="Uses bigger cards, clearer spacing, stronger borders, and more obvious actions."
        >
          <SettingToggle
            checked={settings.simpleView}
            onChange={(value) => updateSetting("simpleView", value)}
          />
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Comfort</span>
          <h2>Motion comfort</h2>
          <p>Reduce extra movement for a calmer experience.</p>
        </div>

        <SettingCard
          icon={MousePointerClick}
          title="Reduce Motion"
          description="Turns off extra animations, hover movement, transitions, and scanner-style motion effects."
        >
          <SettingToggle
            checked={settings.reduceMotion}
            onChange={(value) => updateSetting("reduceMotion", value)}
          />
        </SettingCard>
      </section>

      <section className="settings-reset-section">
        <button type="button" className="settings-reset-btn" onClick={resetSettings}>
          <RotateCcw size={18} />
          Reset display settings
        </button>
      </section>
    </main>
  );
}