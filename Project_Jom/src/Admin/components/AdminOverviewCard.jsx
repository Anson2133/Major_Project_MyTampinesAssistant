import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileSearch,
  HeartPulse,
  Users,
} from "lucide-react";

const iconMap = {
  profiles: Users,
  interactions: Activity,
  topCategory: BarChart3,
  highestFriction: AlertTriangle,
  policyGaps: FileSearch,
  outreach: HeartPulse,
};

export default function AdminOverviewCard({ item }) {
  const Icon = iconMap[item.id] || BarChart3;

  return (
    <article className={`admin-kpi-card tone-${item.tone}`}>
      <div className="admin-kpi-icon">
        <Icon size={24} />
      </div>

      <div className="admin-kpi-content">
        <span>{item.label}</span>
        <strong>{item.value}</strong>

        {item.subtitle && <em className="admin-kpi-subtitle">{item.subtitle}</em>}

        <p>{item.description}</p>
        <small>{item.change}</small>
      </div>
    </article>
  );
}