import { useEffect, useMemo, useState } from "react";
import {
  helpCategories as localCategories,
  helpDirectory as localDirectory,
  helpFaqs as localFaqs,
  helpQuickActions as localQuickActions,
} from "../data/helpDirectoryData";

const HELP_DIRECTORY_API =
  "https://9pidtz8z27.execute-api.us-east-1.amazonaws.com/help-directory";

export default function useHelpDirectory() {
  const [directoryItems, setDirectoryItems] = useState(localDirectory);
  const [apiCategories, setApiCategories] = useState(localCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openDirectoryId, setOpenDirectoryId] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(HELP_DIRECTORY_API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch directory");
      }

      setDirectoryItems(
        Array.isArray(data.items) && data.items.length > 0
          ? data.items
          : localDirectory
      );

      setApiCategories(
        Array.isArray(data.categories) && data.categories.length > 0
          ? data.categories
          : localCategories
      );
    } catch (err) {
      console.error("Failed to fetch help directory", err);
      setError(err.message);
      setDirectoryItems(localDirectory);
      setApiCategories(localCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  const filteredDirectory = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return directoryItems
      .filter((item) => {
        const categoryMatch =
          selectedCategory === "All" || item.category === selectedCategory;

        if (!categoryMatch) return false;

        if (!query) return true;

        const searchableText = [
          item.name,
          item.category,
          item.description,
          item.phone,
          item.email,
          item.website,
          item.address,
          item.openingHours,
          item.note,
          item.sourceUrl,
          ...(item.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort((a, b) => {
        const priorityDiff =
          Number(a.priority || 999) - Number(b.priority || 999);

        if (priorityDiff !== 0) return priorityDiff;

        return String(a.name || "").localeCompare(String(b.name || ""));
      });
  }, [directoryItems, searchTerm, selectedCategory]);

  const emergencyItems = useMemo(() => {
    return directoryItems
      .filter(
        (item) =>
          item.isEmergency === true ||
          item.category === "Emergency" ||
          item.category === "Scams & Safety"
      )
      .sort((a, b) => Number(a.priority || 999) - Number(b.priority || 999))
      .slice(0, 4);
  }, [directoryItems]);

  const toggleDirectoryItem = (id) => {
    setOpenDirectoryId((current) => (current === id ? null : id));
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex((current) => (current === index ? null : index));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    openDirectoryId,
    openFaqIndex,

    filteredDirectory,
    emergencyItems,
    helpCategories: apiCategories,
    helpFaqs: localFaqs,
    helpQuickActions: localQuickActions,

    loading,
    error,
    refreshDirectory: fetchDirectory,

    toggleDirectoryItem,
    toggleFaq,
    clearSearch,
  };
}