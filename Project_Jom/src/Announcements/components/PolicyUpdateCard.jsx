import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Clock,
  Bookmark,
  BookmarkCheck,
  Radar,
  Building2,
} from "lucide-react";

function getUrgencyMeta(urgency) {
  if (urgency === "high") {
    return {
      label: "Important",
      className: "high",
      icon: AlertCircle,
    };
  }

  if (urgency === "medium") {
    return {
      label: "Review soon",
      className: "medium",
      icon: Info,
    };
  }

  return {
    label: "General update",
    className: "low",
    icon: CheckCircle2,
  };
}

export default function PolicyUpdateCard({
  update,
  personalised = false,
  onTogglePin,
  onToggleCategory,
  onToggleSource,
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const urgencyMeta = getUrgencyMeta(update.urgency);
  const UrgencyIcon = urgencyMeta.icon;

  const hasDetails =
    (Array.isArray(update.whatChanged) && update.whatChanged.length > 0) ||
    (Array.isArray(update.whoMayCare) && update.whoMayCare.length > 0) ||
    personalised;

  return (
    <article className="policy-update-card compact">
      <div className="policy-update-card-top">
        <div className="policy-update-main">
          <div className="policy-update-pills">
            {personalised && (
              <span className="policy-personal-pill">May affect you</span>
            )}

            {update.isPinned && (
              <span className="policy-watched-pill">Pinned</span>
            )}

            {update.isWatchedCategory && (
              <span className="policy-watched-pill">Watching category</span>
            )}

            {update.isWatchedSource && (
              <span className="policy-watched-pill">Watching source</span>
            )}

            <span className="policy-category-pill">
              {update.categoryLabel || "Support Update"}
            </span>

            <span className={`policy-urgency-pill ${urgencyMeta.className}`}>
              <UrgencyIcon size={14} />
              {urgencyMeta.label}
            </span>
          </div>

          <h3>{update.title}</h3>
        </div>

        <div className="policy-date">
          <Clock size={15} />
          <span>{update.publishedDate || "Recently"}</span>
        </div>
      </div>

      <p className="policy-summary">
        {update.summary || "No summary available."}
      </p>

      {update.actionNeeded && (
        <div className="policy-action-box compact-action">
          <strong>Suggested action</strong>
          <p>{update.actionNeeded}</p>
        </div>
      )}

      <div className="policy-card-actions">
        {hasDetails && (
          <button
            type="button"
            className="policy-details-toggle"
            onClick={() => setDetailsOpen((current) => !current)}
          >
            {detailsOpen ? "Hide details" : "Show details"}
            {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        <div className="policy-watch-actions">
          {onTogglePin && (
            <button
              type="button"
              className={
                update.isPinned ? "policy-watch-btn active" : "policy-watch-btn"
              }
              onClick={() => onTogglePin(update)}
            >
              {update.isPinned ? (
                <BookmarkCheck size={16} />
              ) : (
                <Bookmark size={16} />
              )}
              {update.isPinned ? "Pinned" : "Pin"}
            </button>
          )}

          {onToggleCategory && (
            <button
              type="button"
              className={
                update.isWatchedCategory
                  ? "policy-watch-btn active"
                  : "policy-watch-btn"
              }
              onClick={() => onToggleCategory(update)}
            >
              <Radar size={16} />
              {update.isWatchedCategory
                ? `Watching ${update.categoryLabel || "category"}`
                : `Watch ${update.categoryLabel || "category"}`}
            </button>
          )}

          {onToggleSource && (
            <button
              type="button"
              className={
                update.isWatchedSource
                  ? "policy-watch-btn active"
                  : "policy-watch-btn"
              }
              onClick={() => onToggleSource(update)}
            >
              <Building2 size={16} />
              {update.isWatchedSource ? "Watching source" : "Watch source"}
            </button>
          )}
        </div>
      </div>

      {detailsOpen && (
        <div className="policy-expanded-details">
          {personalised && (
            <div className="policy-why-box">
              <strong>Why this is shown</strong>
              <p>
                {update.personalisationReason ||
                  "This update may be relevant based on your saved profile or recent support activity."}
              </p>
            </div>
          )}

          {Array.isArray(update.whatChanged) && update.whatChanged.length > 0 && (
            <div className="policy-detail-box">
              <strong>What changed</strong>

              <ul>
                {update.whatChanged.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(update.whoMayCare) && update.whoMayCare.length > 0 && (
            <div className="policy-detail-box muted">
              <strong>Who may care</strong>

              <div className="policy-chip-row">
                {update.whoMayCare.slice(0, 4).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="policy-card-footer">
        <div>
          <span>Source</span>
          <strong>
            {update.sourceAgency || update.sourceName || "Official source"}
          </strong>
        </div>

        {update.sourceUrl && (
          <a
            href={update.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="policy-source-link"
          >
            Read official update
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </article>
  );
}