import { useCallback, useEffect, useState } from "react";
import { adminOverviewData } from "../data/adminOverviewData";

const ADMIN_OVERVIEW_API =
    import.meta.env.VITE_ADMIN_OVERVIEW_API ||
    "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/admin/overview";

function buildFallbackOverview() {
    const totalInteractions = adminOverviewData.demandSnapshot.reduce(
        (sum, item) => sum + item.interactions,
        0
    );

    const topDemandCategory = [...adminOverviewData.demandSnapshot].sort(
        (a, b) => b.interactions - a.interactions
    )[0];

    return {
        ...adminOverviewData,
        totalInteractions,
        topDemandCategory,
    };
}

export default function useAdminOverview() {
    const [overview, setOverview] = useState(buildFallbackOverview);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOverview = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(ADMIN_OVERVIEW_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load admin overview");
            }

            setOverview({
                ...buildFallbackOverview(),
                ...data,
            });
        } catch (err) {
            console.error("Admin overview failed:", err);

            setError(
                "Using fallback demo analytics because the live admin API could not be loaded."
            );

            setOverview(buildFallbackOverview());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverview();
    }, [fetchOverview]);

    return {
        overview,
        loading,
        error,
        refreshOverview: fetchOverview,
    };
}