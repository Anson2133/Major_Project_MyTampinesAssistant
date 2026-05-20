import { useEffect, useState } from "react";

const POLICY_API =
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/policy-updates";

function getUserId() {
  return localStorage.getItem("userId") || "demo-user-001";
}

export default function useAnnouncementBadge() {
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);
  const [latestCount, setLatestCount] = useState(0);

  useEffect(() => {
    const checkUnread = async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("cachedProfile") || "{}");

        const params = new URLSearchParams({
          category: "all",
          limit: "30",
          userId: getUserId(),
          profile: JSON.stringify(profile),
        });

        const res = await fetch(`${POLICY_API}?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) return;

        const count = data.unreadWatchCount || 0;

        setLatestCount(count);
        setHasUnreadAnnouncements(count > 0);
      } catch (err) {
        console.error("Failed to check announcement badge", err);
      }
    };

    checkUnread();

    const interval = setInterval(checkUnread, 5 * 60 * 1000);

    window.addEventListener("policyWatchSeen", checkUnread);

    return () => {
      clearInterval(interval);
      window.removeEventListener("policyWatchSeen", checkUnread);
    };
  }, []);

  return {
    hasUnreadAnnouncements,
    latestCount,
  };
}