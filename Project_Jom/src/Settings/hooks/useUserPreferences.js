import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import i18n from "i18next";

const USER_PREFERENCES_API =
    "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/user-preferences";

const STORAGE_KEY = "mytampinesAppSettings";
const OLD_DISPLAY_STORAGE_KEY = "mytampinesDisplaySettings";

export const DEFAULT_USER_PREFERENCES = {
    textSize: "normal",
    guidedMode: false,
    reduceMotion: false,

    language: localStorage.getItem("i18nextLng") || "en",
    chatbotReplyStyle: "simple",

    journeyMode: "guided",
    showEligibilityReasons: true,
    showDocumentChecklist: true,

    preferredArea: "tampines",
    travelMode: "publicTransport",

    policyAlerts: true,
    alertLevel: "importantOnly",

    saveProfileLocally: true,
};

function safeJsonParse(value, fallback = {}) {
    try {
        return JSON.parse(value || "{}");
    } catch {
        return fallback;
    }
}

function getUserId() {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) return storedUserId;

    const user = safeJsonParse(localStorage.getItem("user"));
    const profile = safeJsonParse(localStorage.getItem("profile"));
    const cachedProfile = safeJsonParse(localStorage.getItem("cachedProfile"));

    return (
        user?.userId ||
        user?.id ||
        profile?.userId ||
        cachedProfile?.userId ||
        "demo-user-001"
    );
}

function readLocalPreferences() {
    const savedPreferences = safeJsonParse(localStorage.getItem(STORAGE_KEY));

    const oldDisplaySettings = safeJsonParse(
        localStorage.getItem(OLD_DISPLAY_STORAGE_KEY)
    );

    return {
        ...DEFAULT_USER_PREFERENCES,

        // Migration from your old settings
        textSize:
            oldDisplaySettings.textSize || DEFAULT_USER_PREFERENCES.textSize,

        guidedMode:
            oldDisplaySettings.simpleView ??
            DEFAULT_USER_PREFERENCES.guidedMode,

        reduceMotion:
            oldDisplaySettings.reduceMotion ??
            DEFAULT_USER_PREFERENCES.reduceMotion,

        ...savedPreferences,
    };
}

function saveLocalPreferences(preferences) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    // Keep this temporarily so old layout code does not break
    localStorage.setItem(
        OLD_DISPLAY_STORAGE_KEY,
        JSON.stringify({
            textSize: preferences.textSize,
            simpleView: preferences.guidedMode,
            reduceMotion: preferences.reduceMotion,
        })
    );

    localStorage.setItem("i18nextLng", preferences.language || "en");

    if (i18n?.changeLanguage) {
        i18n.changeLanguage(preferences.language || "en");
    }

    window.dispatchEvent(new Event("mytampines-settings-changed"));
}

async function loadRemotePreferences(userId) {
    const response = await fetch(
        `${USER_PREFERENCES_API}?userId=${encodeURIComponent(userId)}`
    );

    if (!response.ok) {
        throw new Error("Failed to load preferences.");
    }

    const data = await response.json();

    return data?.preferences || null;
}

async function saveRemotePreferences(userId, preferences) {
    const response = await fetch(USER_PREFERENCES_API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId,
            preferences,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to save preferences.");
    }

    return response.json();
}

export default function useUserPreferences() {
    const userId = useMemo(() => getUserId(), []);
    const firstSaveSkipped = useRef(false);
    const saveTimerRef = useRef(null);

    const [preferences, setPreferences] = useState(readLocalPreferences);
    const [loading, setLoading] = useState(true);
    const [syncStatus, setSyncStatus] = useState("local");
    const [error, setError] = useState("");

    const updatePreference = useCallback((key, value) => {
        setPreferences((current) => ({
            ...current,
            [key]: value,
        }));
    }, []);

    const updatePreferences = useCallback((updates) => {
        setPreferences((current) => ({
            ...current,
            ...updates,
        }));
    }, []);

    const resetPreferences = useCallback(() => {
        const resetValue = {
            ...DEFAULT_USER_PREFERENCES,
            language: localStorage.getItem("i18nextLng") || "en",
        };

        setPreferences(resetValue);
    }, []);

    const clearSavedProfile = useCallback(() => {
        localStorage.removeItem("profile");
        localStorage.removeItem("cachedProfile");
        window.dispatchEvent(new Event("mytampines-settings-changed"));
    }, []);

    const clearChatHistory = useCallback(() => {
        localStorage.removeItem("chatHistory");
        localStorage.removeItem("conversations");
        localStorage.removeItem("currentConversationId");
    }, []);

    const clearAllLocalData = useCallback(() => {
        const keepLanguage = preferences.language || "en";

        localStorage.clear();
        localStorage.setItem("i18nextLng", keepLanguage);

        const cleanPreferences = {
            ...DEFAULT_USER_PREFERENCES,
            language: keepLanguage,
        };

        saveLocalPreferences(cleanPreferences);
        setPreferences(cleanPreferences);
    }, [preferences.language]);

    const refreshPreferences = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setSyncStatus("loading");

            const remotePreferences = await loadRemotePreferences(userId);

            if (remotePreferences) {
                const mergedPreferences = {
                    ...DEFAULT_USER_PREFERENCES,
                    ...readLocalPreferences(),
                    ...remotePreferences,
                };

                saveLocalPreferences(mergedPreferences);
                setPreferences(mergedPreferences);
                setSyncStatus("synced");
            } else {
                const localPreferences = readLocalPreferences();
                saveLocalPreferences(localPreferences);
                setPreferences(localPreferences);
                setSyncStatus("local");
            }
        } catch (err) {
            console.error("Could not load user preferences:", err);
            setError(err.message || "Could not load preferences.");
            setSyncStatus("offline");

            const localPreferences = readLocalPreferences();
            saveLocalPreferences(localPreferences);
            setPreferences(localPreferences);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        refreshPreferences();
    }, [refreshPreferences]);

    useEffect(() => {
        saveLocalPreferences(preferences);

        // Prevent saving immediately before the first GET has completed
        if (!firstSaveSkipped.current) {
            firstSaveSkipped.current = true;
            return;
        }

        clearTimeout(saveTimerRef.current);

        saveTimerRef.current = setTimeout(async () => {
            try {
                setError("");
                setSyncStatus("saving");

                await saveRemotePreferences(userId, preferences);

                setSyncStatus("synced");
            } catch (err) {
                console.error("Could not save user preferences:", err);
                setError(err.message || "Could not save preferences.");
                setSyncStatus("offline");
            }
        }, 500);

        return () => {
            clearTimeout(saveTimerRef.current);
        };
    }, [preferences, userId]);

    const syncLabel =
        syncStatus === "loading"
            ? "Loading saved preferences..."
            : syncStatus === "saving"
                ? "Saving preferences..."
                : syncStatus === "synced"
                    ? "Preferences synced"
                    : syncStatus === "offline"
                        ? "Saved on this browser. Cloud sync unavailable."
                        : "Saved on this browser";

    return {
        userId,
        preferences,
        setPreferences,
        updatePreference,
        updatePreferences,
        resetPreferences,
        clearSavedProfile,
        clearChatHistory,
        clearAllLocalData,
        refreshPreferences,
        loading,
        syncStatus,
        syncLabel,
        error,
    };
}