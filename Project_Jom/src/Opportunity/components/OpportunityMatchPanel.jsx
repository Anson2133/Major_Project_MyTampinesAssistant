import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import OpportunityPostCard from "./OpportunityPostCard";

export default function OpportunityMatchPanel({
  matches,
  matchesLoading,
  onFindMatches,
  onMessage,
  onSelect,
}) {
  const [matchInput, setMatchInput] = useState({
    skills: "",
    supportNeed: "",
    availability: "",
  });

  const updateField = (field, value) => {
    setMatchInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFindMatches(matchInput);
  };

  return (
    <section className="opp-section">
      <div className="opp-section-header">
        <span className="opp-section-kicker">Matching</span>
        <h2>Find suitable opportunities</h2>
        <p>Select a resident situation and the system will suggest matches.</p>
      </div>

      <form className="opp-match-box simple" onSubmit={handleSubmit}>
        <label>
          Main skill
          <select
            value={matchInput.skills}
            onChange={(e) => updateField("skills", e.target.value)}
          >
            <option value="">Select skill</option>
            <option value="customer service">Customer service</option>
            <option value="cashier">Cashier</option>
            <option value="packing">Packing</option>
            <option value="admin">Admin</option>
            <option value="retail">Retail</option>
            <option value="f&b">F&B</option>
          </select>
        </label>

        <label>
          Support need
          <select
            value={matchInput.supportNeed}
            onChange={(e) => updateField("supportNeed", e.target.value)}
          >
            <option value="">Select need</option>
            <option value="job loss">Job loss</option>
            <option value="part-time work">Part-time work</option>
            <option value="urgent income support">Urgent income support</option>
            <option value="training opportunity">Training opportunity</option>
            <option value="community volunteering">
              Community volunteering
            </option>
          </select>
        </label>

        <label>
          Availability
          <select
            value={matchInput.availability}
            onChange={(e) => updateField("availability", e.target.value)}
          >
            <option value="">Select availability</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
            <option value="Flexible">Flexible</option>
          </select>
        </label>

        <button type="submit" disabled={matchesLoading}>
          {matchesLoading ? (
            <>
              <Loader2 size={18} className="spin-icon" />
              Matching...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Find matches
            </>
          )}
        </button>
      </form>

      {matches.length === 0 ? (
        <div className="opp-empty-card compact">
          <h3>No matches loaded yet</h3>
          <p>Choose the dropdowns and click Find matches.</p>
        </div>
      ) : (
        <div className="opp-post-grid simple">
          {matches.map((post) => (
            <OpportunityPostCard
              key={post.postId}
              post={post}
              showMatch
              onMessage={onMessage}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}