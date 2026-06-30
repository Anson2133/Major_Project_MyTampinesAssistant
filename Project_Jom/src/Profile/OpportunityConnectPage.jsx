import {
    Building2,
    Loader2,
    MessageSquare,
    Search,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from "lucide-react";
import "../opportunity-connect.css";
import useOpportunityConnect from "../hooks/useOpportunityConnect";
import OpportunityPostForm from "../components/OpportunityPostForm";
import OpportunityPostCard from "../components/OpportunityPostCard";
import OpportunityMatchPanel from "../components/OpportunityMatchPanel";
import OpportunityMessagePanel from "../components/OpportunityMessagePanel";
import { useState } from "react";

export default function OpportunityConnectPage() {
    const {
        displayName,
        posts,
        matches,
        conversations,
        selectedConversation,
        messages,

        postsLoading,
        matchesLoading,
        conversationsLoading,
        messagesLoading,
        posting,
        sending,

        error,
        success,

        fetchPosts,
        createPost,
        fetchMatches,
        startConversation,
        selectConversation,
        sendMessage,
    } = useOpportunityConnect();

    const [filters, setFilters] = useState({
        search: "",
        location: "",
        skill: "",
    });

    const [selectedPost, setSelectedPost] = useState(null);

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

    const handleMessage = async (post) => {
        setSelectedPost(post);
        setMessageDraft(
            post.suggestedMessage ||
            `Hi, I saw your opportunity "${post.title}" on MyTampines Assistant and would like to find out more.`
        );

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleStartConversation = async () => {
        if (!selectedPost || !messageDraft.trim()) return;

        await startConversation(selectedPost, messageDraft);
        setSelectedPost(null);
        setMessageDraft("");
    };

    return (
        <main className="opp-page">
            <section className="opp-hero">
                <div>
                    <span className="opp-hero-pill">
                        <Sparkles size={18} />
                        Opportunity Connect
                    </span>

                    <h1>Connect residents with trusted local opportunities</h1>

                    <p>
                        Businesses can share local work or support opportunities with basic
                        verification details, while residents can discover suitable options
                        and start a guided conversation.
                    </p>

                    <div className="opp-hero-stats">
                        <div>
                            <strong>{posts.length}</strong>
                            <span>Open opportunities</span>
                        </div>
                        <div>
                            <strong>{conversations.length}</strong>
                            <span>Conversations</span>
                        </div>
                        <div>
                            <strong>AI</strong>
                            <span>Match guidance</span>
                        </div>
                    </div>
                </div>

                <div className="opp-hero-visual">
                    <div className="opp-trust-card">
                        <div className="opp-trust-header">
                            <div className="opp-trust-icon">
                                <ShieldCheck size={26} />
                            </div>
                            <div>
                                <strong>Government-style safety layer</strong>
                                <span>Built for resident support journeys</span>
                            </div>
                        </div>

                        <div className="opp-trust-list">
                            <div>
                                <Building2 size={18} />
                                Business credentials captured
                            </div>
                            <div>
                                <UsersRound size={18} />
                                Residents can discover nearby options
                            </div>
                            <div>
                                <MessageSquare size={18} />
                                Built-in messaging for follow-up
                            </div>
                        </div>

                        <div className="opp-trust-footer">
                            Opportunities are guidance only. Final checks should be completed
                            by the relevant organisation.
                        </div>
                    </div>
                </div>
            </section>

            {(error || success) && (
                <section className="opp-section">
                    {error && <div className="opp-alert error">{error}</div>}
                    {success && <div className="opp-alert success">{success}</div>}
                </section>
            )}

            <section className="opp-layout">
                <div className="opp-main-column">
                    <OpportunityPostForm onSubmit={createPost} posting={posting} />

                    <section className="opp-section">
                        <div className="opp-section-header with-action">
                            <div>
                                <span className="opp-section-kicker">Browse</span>
                                <h2>Open opportunities</h2>
                                <p>
                                    Explore business-submitted opportunities and message the poster
                                    to ask for more details.
                                </p>
                            </div>
                        </div>

                        <form className="opp-search-row" onSubmit={handleSearch}>
                            <div className="opp-search-box">
                                <Search size={19} />
                                <input
                                    value={filters.search}
                                    onChange={(e) => updateFilter("search", e.target.value)}
                                    placeholder="Search opportunities..."
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

                            <button type="submit">Search</button>
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
                                <p>
                                    Try submitting a demo opportunity or clearing your search
                                    filters.
                                </p>
                            </div>
                        ) : (
                            <div className="opp-post-grid">
                                {posts.map((post) => (
                                    <OpportunityPostCard
                                        key={post.postId}
                                        post={post}
                                        onMessage={handleMessage}
                                        onSelect={setSelectedPost}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <OpportunityMatchPanel
                        matches={matches}
                        matchesLoading={matchesLoading}
                        onFindMatches={fetchMatches}
                        onMessage={handleMessage}
                        onSelect={setSelectedPost}
                    />

                    {selectedPost && (
                        <section className="opp-section">
                            <div className="opp-message-start-card">
                                <div>
                                    <span className="opp-section-kicker">Start conversation</span>
                                    <h2>{selectedPost.title}</h2>
                                    <p>
                                        Send a message to the opportunity poster to clarify details
                                        such as working hours, suitability, or next steps.
                                    </p>
                                </div>

                                <textarea
                                    value={messageDraft}
                                    onChange={(e) => setMessageDraft(e.target.value)}
                                    rows={4}
                                    placeholder="Type your first message..."
                                />

                                <div className="opp-message-start-actions">
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => {
                                            setSelectedPost(null);
                                            setMessageDraft("");
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={sending || !messageDraft.trim()}
                                        onClick={handleStartConversation}
                                    >
                                        {sending ? "Starting..." : "Start conversation"}
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <OpportunityMessagePanel
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    messages={messages}
                    conversationsLoading={conversationsLoading}
                    messagesLoading={messagesLoading}
                    sending={sending}
                    displayName={displayName}
                    onSelectConversation={selectConversation}
                    onSendMessage={sendMessage}
                />
            </section>
        </main>
    );
}