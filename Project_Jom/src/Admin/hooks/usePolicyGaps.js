import { useCallback, useEffect, useState } from "react";

const POLICY_GAPS_API =
  import.meta.env.VITE_ADMIN_POLICY_GAPS_API ||
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/admin/policy-gaps";

const fallbackPolicyGaps = {
  generatedAt: "",
  totalProfiles: 0,
  totalInteractions: 0,
  totalCategoriesAnalysed: 0,
  highPriorityGaps: 0,
  executiveSummary:
    "Policy gap analysis is loading. Check the API Gateway route and Lambda integration if this remains visible.",
  gaps: [],
};

export default function usePolicyGaps() {
  const [policyGaps, setPolicyGaps] = useState(fallbackPolicyGaps);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolicyGaps = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(POLICY_GAPS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load policy gaps");
      }

      setPolicyGaps({
        ...fallbackPolicyGaps,
        ...data,
      });
    } catch (err) {
      console.error("Policy gap analysis failed:", err);
      setError(
        "Unable to load live policy gap analysis. Check Lambda, API Gateway route, and CORS settings."
      );
      setPolicyGaps(fallbackPolicyGaps);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicyGaps();
  }, [fetchPolicyGaps]);

  return {
    policyGaps,
    loading,
    error,
    refreshPolicyGaps: fetchPolicyGaps,
  };
}