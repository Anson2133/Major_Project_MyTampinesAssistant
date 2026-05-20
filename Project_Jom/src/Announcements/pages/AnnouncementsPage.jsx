import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Newspaper,
  Radar,
  RefreshCcw,
  Search,
  ShieldCheck,
} from "lucide-react";

import usePolicyUpdates from "../hooks/usePolicyUpdates";
import PolicyUpdateCard from "../components/PolicyUpdateCard";
import PolicyCategoryFilter from "../components/PolicyCategoryFilter";
import {
  togglePinNotice,
  toggleWatchCategory,
  toggleWatchSource,
  markPolicyWatchSeen,
} from "../hooks/usePolicyWatchActions";

import "../announcements.css";

export default function AnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    latest,
    personalised,
    categories,
    watchTargets,
    pinnedUpdates,
    watchedUpdates,
    loading,
    error,
    refresh,
  } = usePolicyUpdates(selectedCategory);

  useEffect(() => {
    const markSeen = async () => {
      try {
        await markPolicyWatchSeen();
        window.dispatchEvent(new Event("policyWatchSeen"));
        refresh();
      } catch (err) {
        console.error("Failed to mark watched updates as seen", err);
      }
    };

    markSeen();
  }, [refresh]);

  const handleTogglePin = async (update) => {
    try {
      await togglePinNotice(update);
      await refresh();
      window.dispatchEvent(new Event("policyWatchSeen"));
    } catch (err) {
      console.error("Failed to toggle pin", err);
    }
  };

  const handleToggleCategory = async (update) => {
    try {
      await toggleWatchCategory(update);
      await refresh();
      window.dispatchEvent(new Event("policyWatchSeen"));
    } catch (err) {
      console.error("Failed to toggle watched category", err);
    }
  };

  const handleToggleSource = async (update) => {
    try {
      await toggleWatchSource(update);
      await refresh();
      window.dispatchEvent(new Event("policyWatchSeen"));
    } catch (err) {
      console.error("Failed to toggle watched source", err);
    }
  };

  const filteredLatest = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return latest;

    return latest.filter((update) => {
      const searchableText = [
        update.title,
        update.summary,
        update.categoryLabel,
        update.sourceAgency,
        update.sourceName,
        update.actionNeeded,
        ...(update.tags || []),
        ...(update.whoMayCare || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [latest, searchTerm]);

  const cardActions = {
    onTogglePin: handleTogglePin,
    onToggleCategory: handleToggleCategory,
    onToggleSource: handleToggleSource,
  };

  return (
    <main className="announcements-page">
      <section className="policy-hero">
        <div className="policy-hero-content">
          <span className="policy-hero-pill">
            <Radar size={16} />
            Policy Watch
          </span>

          <h1>Stay updated on support changes that may matter to you</h1>

          <p>
            Track support announcements, document reminders, community advisories,
            and policy updates in one place. We summarise updates in plain
            language and highlight what may be relevant to your saved profile.
          </p>

          <div className="policy-hero-stats">
            <div>
              <strong>{latest.length}</strong>
              <span>Latest updates</span>
            </div>

            <div>
              <strong>{personalised.length}</strong>
              <span>May affect you</span>
            </div>

            <div>
              <strong>{watchTargets.length}</strong>
              <span>Watched areas</span>
            </div>
          </div>
        </div>

        <div className="policy-hero-visual">
          <div className="policy-monitor-card">
            <div className="policy-monitor-header">
              <div className="policy-monitor-icon">
                <Bell size={22} />
              </div>

              <div>
                <strong>Policy Watch active</strong>
                <span>Monitoring support updates</span>
              </div>
            </div>

            <div className="policy-monitor-list">
              <div>
                <span className="dot high" />
                Healthcare update detected
              </div>

              <div>
                <span className="dot medium" />
                Financial support reminder
              </div>

              <div>
                <span className="dot low" />
                Community advisory checked
              </div>
            </div>

            <div className="policy-monitor-footer">
              <ShieldCheck size={16} />
              Official-source links included
            </div>
          </div>
        </div>
      </section>

      <section className="policy-section">
        <div className="policy-section-header">
          <div>
            <span className="section-kicker">Personalised alerts</span>
            <h2>Updates that may affect you</h2>
            <p>
              These are highlighted based on your saved profile and support areas
              that may be relevant to you.
            </p>
          </div>
        </div>

        {loading && (
          <div className="policy-state-card">
            <RefreshCcw size={20} className="spin-icon" />
            Loading personalised updates...
          </div>
        )}

        {!loading && error && (
          <div className="policy-state-card error">
            Could not load policy updates. {error}
          </div>
        )}

        {!loading && !error && personalised.length === 0 && (
          <div className="policy-empty-card">
            <h3>No personalised alerts yet</h3>
            <p>
              Once you watch support areas, scan documents, or check support
              options, relevant updates can appear here.
            </p>
          </div>
        )}

        {!loading && !error && personalised.length > 0 && (
          <div className="policy-personalised-grid">
            {personalised.map((update) => (
              <PolicyUpdateCard
                key={update.updateId}
                update={update}
                personalised
                {...cardActions}
              />
            ))}
          </div>
        )}
      </section>

      <section className="policy-section">
        <div className="policy-section-header">
          <div>
            <span className="section-kicker">Policy watchlist</span>
            <h2>Support areas you are watching</h2>
            <p>
              New updates from these categories or sources will trigger the red
              dot in the Announcements tab.
            </p>
          </div>
        </div>

        {!loading && !error && watchTargets.length === 0 && (
          <div className="policy-empty-card">
            <h3>No watched areas yet</h3>
            <p>
              Click “Watch category” or “Watch source” on any announcement to
              track future updates.
            </p>
          </div>
        )}

        {!loading && !error && watchTargets.length > 0 && (
          <div className="policy-watchlist-row">
            {watchTargets.map((item) => (
              <div className="policy-watchlist-chip" key={item.watchKey}>
                <strong>{item.targetName}</strong>
                <span>{item.watchType === "category" ? "Category" : "Source"}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && watchedUpdates.length > 0 && (
          <>
            <div className="policy-subsection-title">
              <h3>Recent updates from watched areas</h3>
            </div>

            <div className="policy-updates-list">
              {watchedUpdates.map((update) => (
                <PolicyUpdateCard
                  key={update.updateId}
                  update={update}
                  {...cardActions}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="policy-section">
        <div className="policy-section-header">
          <div>
            <span className="section-kicker">Pinned notices</span>
            <h2>Notices you pinned</h2>
            <p>
              Save important announcements here so you can return to them later.
            </p>
          </div>
        </div>

        {!loading && !error && pinnedUpdates.length === 0 && (
          <div className="policy-empty-card">
            <h3>No pinned notices yet</h3>
            <p>Click “Pin” on any announcement to save it here.</p>
          </div>
        )}

        {!loading && !error && pinnedUpdates.length > 0 && (
          <div className="policy-updates-list">
            {pinnedUpdates.map((update) => (
              <PolicyUpdateCard
                key={update.updateId}
                update={update}
                {...cardActions}
              />
            ))}
          </div>
        )}
      </section>

      <section className="policy-section">
        <div className="policy-section-header with-action">
          <div>
            <span className="section-kicker">Latest announcements</span>
            <h2>Latest support updates</h2>
            <p>
              Browse recent support-related updates, reminders, and community
              advisories.
            </p>
          </div>

          <div className="policy-search-box">
            <Search size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search updates..."
            />
          </div>
        </div>

        <PolicyCategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {loading && (
          <div className="policy-state-card">
            <RefreshCcw size={20} className="spin-icon" />
            Loading latest announcements...
          </div>
        )}

        {!loading && !error && filteredLatest.length === 0 && (
          <div className="policy-empty-card">
            <Newspaper size={26} />
            <h3>No updates found</h3>
            <p>Try another category or search term.</p>
          </div>
        )}

        {!loading && !error && filteredLatest.length > 0 && (
          <div className="policy-updates-list">
            {filteredLatest.map((update) => (
              <PolicyUpdateCard
                key={update.updateId}
                update={update}
                {...cardActions}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}