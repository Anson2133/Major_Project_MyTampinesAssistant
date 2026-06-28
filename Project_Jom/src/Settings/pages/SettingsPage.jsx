import {
  Bell,
  Bot,
  Car,
  ClipboardList,
  Eye,
  FileCheck,
  Languages,
  MapPin,
  MessageSquareText,
  MousePointerClick,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TextCursorInput,
  Trash2,
} from "lucide-react";

import SettingCard, {
  SettingOptionButton,
  SettingToggle,
} from "../components/SettingCard";

import useUserPreferences from "../hooks/useUserPreferences";

import "../settings.css";

export default function SettingsPage() {
  const {
    preferences: settings,
    updatePreference,
    resetPreferences,
    clearSavedProfile,
    clearChatHistory,
    clearAllLocalData,
    loading,
    syncLabel,
    error,
  } = useUserPreferences();

  const handleClearSavedProfile = () => {
    clearSavedProfile();
    alert("Saved profile data has been cleared from this browser.");
  };

  const handleClearChatHistory = () => {
    clearChatHistory();
    alert("Local chatbot history has been cleared from this browser.");
  };

  const handleClearAllLocalData = () => {
    clearAllLocalData();
    alert("Local app data has been cleared from this browser.");
  };

  return (
    <main className="settings-page">
      <section className="settings-hero">
        <div>
          <span className="settings-eyebrow">App Settings</span>
          <h1>Personalise your MyTampines experience</h1>
          <p>
            Choose how the app looks, speaks, guides you, and reminds you about
            services, bookings, documents, and policy updates.
          </p>

          <p className="settings-sync-status">
            {loading ? "Loading preferences..." : syncLabel}
          </p>

          {error && <p className="settings-sync-error">{error}</p>}
        </div>

        <div className="settings-hero-card">
          <Sparkles size={28} />
          <div>
            <strong>Recommended for residents</strong>
            <p>
              Use Guided Mode, simple chatbot replies, document checklists, and
              important policy alerts for the friendliest experience.
            </p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Accessibility</span>
          <h2>Reading and comfort</h2>
          <p>Make the resident app clearer and easier to use.</p>
        </div>

        <SettingCard
          icon={TextCursorInput}
          title="Text Size"
          description="Increase text size for pages, cards, buttons, forms, FAQs, and chatbot content."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.textSize === "normal"}
              onClick={() => updatePreference("textSize", "normal")}
            >
              Normal
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.textSize === "large"}
              onClick={() => updatePreference("textSize", "large")}
            >
              Large
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.textSize === "extraLarge"}
              onClick={() => updatePreference("textSize", "extraLarge")}
            >
              Extra Large
            </SettingOptionButton>
          </div>
        </SettingCard>

        <SettingCard
          icon={Eye}
          title="Guided Mode"
          description="Shows larger cards, clearer spacing, stronger buttons, and more step-by-step layouts."
        >
          <SettingToggle
            checked={settings.guidedMode}
            onChange={(value) => updatePreference("guidedMode", value)}
          />
        </SettingCard>

        <SettingCard
          icon={MousePointerClick}
          title="Reduce Motion"
          description="Turns off extra animations, hover movement, transitions, and scanner-style motion effects."
        >
          <SettingToggle
            checked={settings.reduceMotion}
            onChange={(value) => updatePreference("reduceMotion", value)}
          />
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Language</span>
          <h2>Language and chatbot style</h2>
          <p>Control how the app communicates with you.</p>
        </div>

        <SettingCard
          icon={Languages}
          title="App Language"
          description="Change the main language used across supported translated pages."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.language === "en"}
              onClick={() => updatePreference("language", "en")}
            >
              English
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.language === "zh"}
              onClick={() => updatePreference("language", "zh")}
            >
              中文
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.language === "ms"}
              onClick={() => updatePreference("language", "ms")}
            >
              Melayu
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.language === "ta"}
              onClick={() => updatePreference("language", "ta")}
            >
              தமிழ்
            </SettingOptionButton>
          </div>
        </SettingCard>

        <SettingCard
          icon={Bot}
          title="Chatbot Reply Style"
          description="Simple gives shorter answers. Detailed gives more explanation and reasoning."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.chatbotReplyStyle === "simple"}
              onClick={() => updatePreference("chatbotReplyStyle", "simple")}
            >
              Simple
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.chatbotReplyStyle === "detailed"}
              onClick={() => updatePreference("chatbotReplyStyle", "detailed")}
            >
              Detailed
            </SettingOptionButton>
          </div>
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Services</span>
          <h2>Service journey preferences</h2>
          <p>Choose how much support the service journey should show.</p>
        </div>

        <SettingCard
          icon={ClipboardList}
          title="Service Guidance Mode"
          description="Quick mode shows a shorter journey. Guided mode shows more explanations, reasons, and next steps."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.journeyMode === "quick"}
              onClick={() => updatePreference("journeyMode", "quick")}
            >
              Quick
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.journeyMode === "guided"}
              onClick={() => updatePreference("journeyMode", "guided")}
            >
              Guided
            </SettingOptionButton>
          </div>
        </SettingCard>

        <SettingCard
          icon={MessageSquareText}
          title="Show Eligibility Reasons"
          description="When enabled, service cards and guides can explain why a service may match your profile or selected need."
        >
          <SettingToggle
            checked={settings.showEligibilityReasons}
            onChange={(value) =>
              updatePreference("showEligibilityReasons", value)
            }
          />
        </SettingCard>

        <SettingCard
          icon={FileCheck}
          title="Show Document Checklist"
          description="When enabled, the service journey can show required documents by default before applying."
        >
          <SettingToggle
            checked={settings.showDocumentChecklist}
            onChange={(value) =>
              updatePreference("showDocumentChecklist", value)
            }
          />
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Location</span>
          <h2>Booking and travel preferences</h2>
          <p>Help the app show more useful locations and route estimates.</p>
        </div>

        <SettingCard
          icon={MapPin}
          title="Preferred Area"
          description="Used for service locations, community facilities, and booking suggestions."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.preferredArea === "tampines"}
              onClick={() => updatePreference("preferredArea", "tampines")}
            >
              Tampines
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.preferredArea === "nearMe"}
              onClick={() => updatePreference("preferredArea", "nearMe")}
            >
              Near me
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.preferredArea === "anywhere"}
              onClick={() => updatePreference("preferredArea", "anywhere")}
            >
              Anywhere
            </SettingOptionButton>
          </div>
        </SettingCard>

        <SettingCard
          icon={Car}
          title="Default Travel Mode"
          description="Used when estimating travel time to service centres or booking locations."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.travelMode === "walking"}
              onClick={() => updatePreference("travelMode", "walking")}
            >
              Walking
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.travelMode === "publicTransport"}
              onClick={() => updatePreference("travelMode", "publicTransport")}
            >
              Public Transport
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.travelMode === "driving"}
              onClick={() => updatePreference("travelMode", "driving")}
            >
              Driving
            </SettingOptionButton>
          </div>
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Policy Watch</span>
          <h2>Updates and alerts</h2>
          <p>Control how policy updates are highlighted for you.</p>
        </div>

        <SettingCard
          icon={Bell}
          title="Policy Watch Alerts"
          description="When enabled, the app can highlight new schemes, announcements, and policy updates that may matter to you."
        >
          <SettingToggle
            checked={settings.policyAlerts}
            onChange={(value) => updatePreference("policyAlerts", value)}
          />
        </SettingCard>

        <SettingCard
          icon={ShieldCheck}
          title="Alert Level"
          description="Important Only shows fewer high-impact updates. All Relevant shows more personalised updates."
        >
          <div className="settings-option-group">
            <SettingOptionButton
              active={settings.alertLevel === "importantOnly"}
              onClick={() => updatePreference("alertLevel", "importantOnly")}
            >
              Important Only
            </SettingOptionButton>

            <SettingOptionButton
              active={settings.alertLevel === "allRelevant"}
              onClick={() => updatePreference("alertLevel", "allRelevant")}
            >
              All Relevant
            </SettingOptionButton>
          </div>
        </SettingCard>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-section-kicker">Privacy</span>
          <h2>Saved data</h2>
          <p>Control what this browser remembers for faster use.</p>
        </div>

        <SettingCard
          icon={ShieldCheck}
          title="Save Profile on This Device"
          description="Keeps your selected profile and preferences on this browser for faster service matching."
        >
          <SettingToggle
            checked={settings.saveProfileLocally}
            onChange={(value) => updatePreference("saveProfileLocally", value)}
          />
        </SettingCard>
      </section>

      <section className="settings-reset-section">
        <button
          type="button"
          className="settings-reset-btn"
          onClick={resetPreferences}
        >
          <RotateCcw size={18} />
          Reset settings
        </button>

        <button
          type="button"
          className="settings-reset-btn"
          onClick={handleClearSavedProfile}
        >
          <Trash2 size={18} />
          Clear saved profile
        </button>

        <button
          type="button"
          className="settings-reset-btn"
          onClick={handleClearChatHistory}
        >
          <Trash2 size={18} />
          Clear chat history
        </button>

        <button
          type="button"
          className="settings-reset-btn danger"
          onClick={handleClearAllLocalData}
        >
          <Trash2 size={18} />
          Clear all local data
        </button>
      </section>
    </main>
  );
}