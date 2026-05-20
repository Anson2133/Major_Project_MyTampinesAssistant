import { useCallback, useEffect, useState } from "react";

const POLICY_API =
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/policy-updates";

function getUserId() {
  return localStorage.getItem("userId") || "demo-user-001";
}

export default function usePolicyUpdates(selectedCategory = "all") {
  const [latest, setLatest] = useState([]);
  const [personalised, setPersonalised] = useState([]);
  const [categories, setCategories] = useState([]);
  const [watchItems, setWatchItems] = useState([]);
  const [watchTargets, setWatchTargets] = useState([]);
  const [pinnedUpdates, setPinnedUpdates] = useState([]);
  const [watchedUpdates, setWatchedUpdates] = useState([]);
  const [unreadWatchCount, setUnreadWatchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const profile = JSON.parse(localStorage.getItem("cachedProfile") || "{}");

      const params = new URLSearchParams({
        category: selectedCategory,
        limit: "30",
        userId: getUserId(),
        profile: JSON.stringify(profile),
      });

      const res = await fetch(`${POLICY_API}?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load policy updates");
      }

      setLatest(data.latest || []);
      setPersonalised(data.personalised || []);
      setCategories(data.categories || []);
      setWatchItems(data.watchItems || []);
      setWatchTargets(data.watchTargets || []);
      setPinnedUpdates(data.pinnedUpdates || []);
      setWatchedUpdates(data.watchedUpdates || []);
      setUnreadWatchCount(data.unreadWatchCount || 0);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return {
    latest,
    personalised,
    categories,
    watchItems,
    watchTargets,
    pinnedUpdates,
    watchedUpdates,
    unreadWatchCount,
    loading,
    error,
    refresh: fetchUpdates,
  };
}