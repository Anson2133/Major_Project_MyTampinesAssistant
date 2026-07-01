import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { User, Home, Globe, ArrowRight, Loader2 } from "lucide-react";

function ProfileCard({ profile }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelect = async () => {
    try {
      setLoading(true);
      await login(profile.demoResidentId);
      navigate("/services");
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className={`profile-card ${loading ? "profile-card--loading" : ""}`}>
      {/* Card Header */}
      <div className="profile-card__header">
        <div className={`profile-avatar ${profile.color}`}>
          {profile.initials}
        </div>
        <div className="profile-card__header-text">
          <h2 className="profile-card__name">{profile.name}</h2>
          <p className="profile-card__role">{profile.role}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="profile-card__body">
        <div className="profile-details">
          <div className="profile-detail-row">
            <User size={15} className="profile-detail-icon" />
            <span>{profile.age}</span>
          </div>
          <div className="profile-detail-row">
            <Home size={15} className="profile-detail-icon" />
            <span>{profile.housing}</span>
          </div>
          <div className="profile-detail-row">
            <Globe size={15} className="profile-detail-icon" />
            <span>{profile.languages}</span>
          </div>
        </div>

        {profile.needsHelpWith && profile.needsHelpWith.length > 0 && (
          <div className="profile-needs">
            <p className="profile-needs__label">NEEDS HELP WITH</p>
            <div className="profile-needs__tags">
              {profile.needsHelpWith.map((item) => (
                <span key={item} className="profile-tag">{item}</span>
              ))}
            </div>
          </div>
        )}

        {profile.description && (
          <p className="profile-description">{profile.description}</p>
        )}
      </div>

      {/* CTA Button */}
      <div className="profile-card__footer">
        <button
          className="profile-card__cta"
          onClick={handleSelect}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="profile-card__spinner" />
              Logging in...
            </>
          ) : (
            <>
              <ArrowRight size={16} />
              Start Demo as {profile.name.split(" ").pop()}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
