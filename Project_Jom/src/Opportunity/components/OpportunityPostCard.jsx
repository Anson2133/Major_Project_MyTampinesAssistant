import {
  Building2,
  Clock,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function OpportunityPostCard({
  post,
  onMessage,
  onSelect,
  showMatch = false,
}) {
  const skills = Array.isArray(post.skills) ? post.skills : [];

  return (
    <article className="opp-post-card simple">
      <div className="opp-post-card-header">
        <div>
          <span className="opp-card-type">
            {post.opportunityType || "Opportunity"}
          </span>
          <h3>{post.title}</h3>
        </div>

        {showMatch && (
          <span className="opp-match-score">
            <Sparkles size={14} />
            {post.matchScore || 0}%
          </span>
        )}
      </div>

      <p className="opp-post-description">{post.description}</p>

      <div className="opp-post-meta simple">
        <span>
          <Building2 size={16} />
          {post.businessName || "Business"}
        </span>

        <span>
          <MapPin size={16} />
          {post.location || "Tampines"}
        </span>

        {post.availability && (
          <span>
            <Clock size={16} />
            {post.availability}
          </span>
        )}
      </div>

      {post.payRange && (
        <p className="opp-pay-line">
          <strong>Pay:</strong> {post.payRange}
        </p>
      )}

      {skills.length > 0 && (
        <p className="opp-skill-line">
          <strong>Skills:</strong> {skills.slice(0, 4).join(", ")}
        </p>
      )}

      {showMatch && post.matchReasons?.length > 0 && (
        <div className="opp-match-simple">
          <strong>Why this may fit</strong>
          <p>{post.matchReasons[0]}</p>
        </div>
      )}

      <div className="opp-post-footer">
        <button type="button" className="secondary" onClick={() => onSelect(post)}>
          Details
        </button>

        <button type="button" onClick={() => onMessage(post)}>
          <MessageSquare size={17} />
          Message
        </button>
      </div>
    </article>
  );
}