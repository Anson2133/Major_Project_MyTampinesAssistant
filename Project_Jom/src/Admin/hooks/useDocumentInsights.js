import { useCallback, useEffect, useState } from "react";

const DOCUMENT_INSIGHTS_API =
  import.meta.env.VITE_ADMIN_DOCUMENT_INSIGHTS_API ||
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/admin/document-insights";

const fallbackDocumentInsights = {
  generatedAt: "",
  totalInteractions: 0,
  totalDocumentEvents: 0,
  scamRelatedEvents: 0,
  highRiskEvents: 0,
  mediumRiskEvents: 0,
  serviceLinkedEvents: 0,
  serviceLinkRate: 0,
  scamRate: 0,
  highRiskRate: 0,
  topDocumentType: "Unknown",
  topLinkedCategory: "Unknown",
  executiveSummary:
    "Document intelligence is loading. Check the API Gateway route and Lambda integration if this remains visible.",
  documentTypes: [],
  scamRiskLevels: [],
  categoryBreakdown: [],
  entryPointBreakdown: [],
  scannerToServiceCategories: [],
};

export default function useDocumentInsights() {
  const [documentInsights, setDocumentInsights] = useState(
    fallbackDocumentInsights
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocumentInsights = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(DOCUMENT_INSIGHTS_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load document insights");
      }

      setDocumentInsights({
        ...fallbackDocumentInsights,
        ...data,
      });
    } catch (err) {
      console.error("Document insights failed:", err);
      setError(
        "Unable to load live document intelligence. Check Lambda, API Gateway route, and CORS settings."
      );
      setDocumentInsights(fallbackDocumentInsights);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocumentInsights();
  }, [fetchDocumentInsights]);

  return {
    documentInsights,
    loading,
    error,
    refreshDocumentInsights: fetchDocumentInsights,
  };
}