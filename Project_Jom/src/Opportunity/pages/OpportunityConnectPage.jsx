import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";

import "../opportunity-connect.css";
import useOpportunityConnect from "../hooks/useOpportunityConnect";

import OpportunityPostForm from "../components/OpportunityPostForm";
import OpportunityPostCard from "../components/OpportunityPostCard";
import OpportunityMatchPanel from "../components/OpportunityMatchPanel";

export default function OpportunityConnectPage() {
  const navigate = useNavigate();

  const {
    posts,
    matches,
    postsLoading,
    matchesLoading,
    posting,
    sending,
    aiLoading,
    error,
    success,
    fetchPosts,
    createPost,
    fetchMatches,
    startConversation,
    draftOpportunityPost,
  } = useOpportunityConnect();

  const [activeTab, setActiveTab] = useState("browse");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skill: "",
  });

  const [detailPost, setDetailPost] = useState(null);
  const [messagePost, setMessagePost] = useState(null);
  const [messageDraft, setMessageDraft] = useState("");

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchPosts(filters);
  };

  const clearOpenPanels = () => {
    setDetailPost(null);
    setMessagePost(null);
    setMessageDraft("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    clearOpenPanels();
  };

  const handleOpenMessageBox = (post) => {
    setMessagePost(post);
    setDetailPost(null);
    setMessageDraft(
      `Hi, I saw your opportunity "${post.title}" and would like to find out more.`
    );
  };

  const handleOpenDetails = (post) => {
    setDetailPost(post);
    setMessagePost(null);
    setMessageDraft("");
  };

  const handleStartConversation = async () => {
    if (!messagePost || !messageDraft.trim()) return;

    const conversation = await startConversation(
      messagePost,
      messageDraft.trim()
    );

    clearOpenPanels();

    if (conversation?.conversationId) {
      navigate(
        `/opportunity-connect/inbox?conversationId=${encodeURIComponent(
          conversation.conversationId
        )}`
      );
    } else {
      navigate("/opportunity-connect/inbox");
    }
  };

  return (
    <main className="opp-page simple">
      <section className="opp-simple-hero">
        <div>
          <span className="opp-section-kicker">Opportunity Connect</span>
          <h1>Local opportunities for Tampines residents</h1>
          <p>
            Residents can browse opportunities, find suitable matches, and
            message posters from a separate inbox.
          </p>
        </div>

        <button
          type="button"
          className="opp-primary-btn"
          onClick={() => navigate("/opportunity-connect/inbox")}
        >
          <MessageSquare size={18} />
          Open inbox
        </button>
      </section>

      {(error || success) && (
        <section className="opp-section">
          {error && <div className="opp-alert error">{error}</div>}
          {success && <div className="opp-alert success">{success}</div>}
        </section>
      )}

      <section className="opp-section">
        <div className="opp-tabs">
          <button
            type="button"
            className={activeTab === "browse" ? "active" : ""}
            onClick={() => handleTabChange("browse")}
          >
            Browse
          </button>

          <button
            type="button"
            className={activeTab === "match" ? "active" : ""}
            onClick={() => handleTabChange("match")}
          >
            Match
          </button>

          <button
            type="button"
            className={activeTab === "post" ? "active" : ""}
            onClick={() => handleTabChange("post")}
          >
            Post
          </button>
        </div>
      </section>

      {activeTab === "browse" && (
        <section className="opp-section">
          <div className="opp-section-header">
            <h2>Browse opportunities</h2>
            <p>Search by role, location, or skill.</p>
          </div>

          <form className="opp-search-row simple" onSubmit={handleSearch}>
            <div className="opp-search-box">
              <Search size={18} />
              <input
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search role or business"
              />
            </div>

            <input
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              placeholder="Location"
            />

            <input
              value={filters.skill}
              onChange={(e) => updateFilter("skill", e.target.value)}
              placeholder="Skill"
            />

            <button type="submit">
              <Search size={17} />
              Search
            </button>
          </form>

          {postsLoading ? (
            <div className="opp-state-card">
              <Loader2 size={20} className="spin-icon" />
              Loading opportunities...
            </div>
          ) : posts.length === 0 ? (
            <div className="opp-empty-card">
              <Building2 size={32} />
              <h3>No opportunities found</h3>
              <p>Try changing your search filters.</p>
            </div>
          ) : (
            <div className="opp-post-grid simple">
              {posts.map((post) => (
                <OpportunityPostCard
                  key={post.postId}
                  post={post}
                  onMessage={handleOpenMessageBox}
                  onSelect={handleOpenDetails}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "match" && (
        <OpportunityMatchPanel
          matches={matches}
          matchesLoading={matchesLoading}
          onFindMatches={fetchMatches}
          onMessage={handleOpenMessageBox}
          onSelect={handleOpenDetails}
        />
      )}

      {activeTab === "post" && (
        <section className="opp-section">
          <OpportunityPostForm
            onSubmit={createPost}
            posting={posting}
            onDraftPost={draftOpportunityPost}
            aiLoading={aiLoading}
          />
        </section>
      )}

      {detailPost && (
        <section className="opp-section">
          <div className="opp-detail-card simple">
            <div className="opp-detail-header">
              <div>
                <span className="opp-section-kicker">Opportunity details</span>
                <h2>{detailPost.title}</h2>
                <p>{detailPost.businessName || "Opportunity poster"}</p>
              </div>

              <button
                type="button"
                className="opp-icon-btn"
                onClick={() => setDetailPost(null)}
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            <p className="opp-detail-description">{detailPost.description}</p>

            <div className="opp-detail-grid">
              <div>
                <Building2 size={17} />
                <span>Organisation</span>
                <strong>{detailPost.businessName || "Not provided"}</strong>
              </div>

              <div>
                <MapPin size={17} />
                <span>Location</span>
                <strong>{detailPost.location || "Tampines"}</strong>
              </div>

              <div>
                <Clock size={17} />
                <span>Availability</span>
                <strong>{detailPost.availability || "To be confirmed"}</strong>
              </div>

              <div>
                <UserRound size={17} />
                <span>Type</span>
                <strong>{detailPost.opportunityType || "Opportunity"}</strong>
              </div>
            </div>

            <div className="opp-detail-columns">
              <div>
                <h3>Useful details</h3>
                <dl>
                  <div>
                    <dt>Pay or support</dt>
                    <dd>{detailPost.payRange || "Ask the poster for details"}</dd>
                  </div>
                  <div>
                    <dt>Skills</dt>
                    <dd>
                      {Array.isArray(detailPost.skills) &&
                      detailPost.skills.length > 0
                        ? detailPost.skills.join(", ")
                        : "No specific skills listed"}
                    </dd>
                  </div>
                  {detailPost.matchReasons?.length > 0 && (
                    <div>
                      <dt>Why this may fit</dt>
                      <dd>{detailPost.matchReasons.join(" ")}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3>Contact shown by poster</h3>
                <div className="opp-detail-contact">
                  <span>
                    <UserRound size={16} />
                    {detailPost.contactPerson || "Contact person not listed"}
                  </span>
                  <span>
                    <Mail size={16} />
                    {detailPost.contactEmail || "Email not listed"}
                  </span>
                  <span>
                    <Phone size={16} />
                    {detailPost.contactPhone || "Phone not listed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="opp-detail-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setDetailPost(null)}
              >
                Close
              </button>

              <button type="button" onClick={() => handleOpenMessageBox(detailPost)}>
                <MessageSquare size={17} />
                Message poster
              </button>
            </div>
          </div>
        </section>
      )}

      {messagePost && (
        <section className="opp-section">
          <div className="opp-message-start-card simple">
            <div>
              <span className="opp-section-kicker">Message poster</span>
              <h2>{messagePost.title}</h2>
              <p>
                Send a short message. After starting the conversation, you will
                continue in the inbox.
              </p>
            </div>

            <textarea
              value={messageDraft}
              onChange={(e) => setMessageDraft(e.target.value)}
              rows={4}
              placeholder="Type your message..."
            />

            <div className="opp-message-start-actions">
              <button
                type="button"
                className="secondary"
                onClick={clearOpenPanels}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={sending || !messageDraft.trim()}
                onClick={handleStartConversation}
              >
                {sending ? "Starting..." : "Start chat"}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
