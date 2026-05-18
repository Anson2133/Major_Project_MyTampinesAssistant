import { useCallback, useEffect, useState } from "react";

const SERVICE_DIAGNOSTICS_API =
  import.meta.env.VITE_ADMIN_SERVICE_DIAGNOSTICS_API ||
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/admin/service-diagnostics";

const fallbackDiagnostics = {
  generatedAt: "",
  totalInteractions: 0,
  totalServicesAnalysed: 0,
  highAttentionServices: 0,
  executiveSummary:
    "Service journey diagnostics are loading. If the live API is unavailable, check the API Gateway route and Lambda integration.",
  topServices: [],
  categorySummary: [],
  quickSightExport: {
    status: "not_connected",
    suggestedVisuals: [],
  },
};

export default function useServiceDiagnostics() {
  const [diagnostics, setDiagnostics] = useState(fallbackDiagnostics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDiagnostics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(SERVICE_DIAGNOSTICS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load service diagnostics");
      }

      setDiagnostics({
        ...fallbackDiagnostics,
        ...data,
      });
    } catch (err) {
      console.error("Service diagnostics failed:", err);
      setError(
        "Unable to load live service diagnostics. Check the Lambda, API Gateway route, and CORS settings."
      );
      setDiagnostics(fallbackDiagnostics);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  return {
    diagnostics,
    loading,
    error,
    refreshDiagnostics: fetchDiagnostics,
  };
}