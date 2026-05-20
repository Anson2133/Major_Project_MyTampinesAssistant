import { Check } from "lucide-react";

export default function SettingCard({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <article className="settings-card">
      <div className="settings-card-icon">
        <Icon size={24} />
      </div>

      <div className="settings-card-content">
        <div className="settings-card-text">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="settings-card-control">{children}</div>
      </div>
    </article>
  );
}

export function SettingOptionButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      className={`settings-option-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {active && <Check size={16} />}
      {children}
    </button>
  );
}

export function SettingToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`settings-toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <span>{checked ? "On" : "Off"}</span>
      <div className="settings-toggle-knob" />
    </button>
  );
}