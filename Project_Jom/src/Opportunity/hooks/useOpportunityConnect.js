import { useCallback, useEffect, useMemo, useState } from "react";

const OPPORTUNITY_API =
  import.meta.env.VITE_OPPORTUNITY_API ||
  "https://b83wbajtcf.execute-api.us-east-1.amazonaws.com";

function getUserId() {
  return localStorage.getItem("userId") || "demo-user-001";
}

function getUserRole() {
  return localStorage.getItem("userRole") || "resident";
}

function getCachedProfile() {
  try {
    return JSON.parse(localStorage.getItem("cachedProfile") || "{}");
  } catch {
    return {};
  }
}

function getDisplayName() {
  const profile = getCachedProfile();
  return profile?.displayName || "Demo Resident";
}

function makeClientMessageId() {
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export default function useOpportunityConnect() {
  const [posts, setPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [postsLoading, setPostsLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [sending, setSending] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = useMemo(() => getUserId(), []);
  const userRole = useMemo(() => getUserRole(), []);
  const profile = useMemo(() => getCachedProfile(), []);
  const displayName = useMemo(() => getDisplayName(), []);

  // Keep these so your current UI will not break.
  // Instead of WebSocket "connected", this now means polling mode.
  const socketStatus = "polling";
  const typingText = "";

  const clearNotices = () => {
    setError("");
    setSuccess("");
  };

  const fetchPosts = useCallback(async (filters = {}) => {
    try {
      setPostsLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.location) params.set("location", filters.location);
      if (filters.skill) params.set("skill", filters.skill);

      params.set("status", "open");
      params.set("limit", "50");

      const query = params.toString();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/posts${query ? `?${query}` : ""
        }`
      );

      const data = await parseResponse(res);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load opportunities.");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const createPost = async (form) => {
    try {
      setPosting(true);
      clearNotices();

      const payload = {
        userId,
        businessName: form.businessName,
        uen: form.uen,
        businessAddress: form.businessAddress,
        contactPerson: form.contactPerson,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        title: form.title,
        description: form.description,
        skills: String(form.skills || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        location: form.location,
        availability: form.availability,
        payRange: form.payRange,
        opportunityType: form.opportunityType,
        declarationAccepted: form.declarationAccepted,

        businessVerification: form.businessVerification || null,
        verificationStatus: form.verificationStatus || "pending",
        verificationBadges: form.verificationBadges || [],
      };

      const res = await fetch(`${OPPORTUNITY_API}/opportunity-connect/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await parseResponse(res);

      setSuccess("Opportunity submitted successfully.");
      await fetchPosts();

      return data.post;
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not submit opportunity.");
      throw err;
    } finally {
      setPosting(false);
    }
  };

  const fetchMatches = async (matchInput = {}) => {
    try {
      setMatchesLoading(true);
      clearNotices();

      const params = new URLSearchParams({
        userId,
        skills: matchInput.skills || "",
        supportNeed: matchInput.supportNeed || "",
        availability: matchInput.availability || "",
        profile: JSON.stringify(profile),
      });

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/matches?${params.toString()}`
      );

      const data = await parseResponse(res);
      setMatches(data.matches || []);

      if ((data.matches || []).length === 0) {
        setSuccess("No strong matches yet. Try changing the skills or need.");
      }

      return data.matches || [];
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not generate matches.");
      return [];
    } finally {
      setMatchesLoading(false);
    }
  };

  const fetchConversations = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setConversationsLoading(true);
        }

        const params = new URLSearchParams({ userId });

        const res = await fetch(
          `${OPPORTUNITY_API}/opportunity-connect/conversations?${params.toString()}`
        );

        const data = await parseResponse(res);
        setConversations(data.conversations || []);

        return data.conversations || [];
      } catch (err) {
        console.error(err);

        if (!silent) {
          setError(err.message || "Could not load conversations.");
        }

        return [];
      } finally {
        if (!silent) {
          setConversationsLoading(false);
        }
      }
    },
    [userId]
  );

  const fetchMessages = useCallback(async (conversationId, silent = false) => {
    if (!conversationId) return [];

    try {
      if (!silent) {
        setMessagesLoading(true);
      }

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/conversations/${encodeURIComponent(
          conversationId
        )}/messages`
      );

      const data = await parseResponse(res);
      setMessages(data.messages || []);

      return data.messages || [];
    } catch (err) {
      console.error(err);

      if (!silent) {
        setError(err.message || "Could not load messages.");
      }

      return [];
    } finally {
      if (!silent) {
        setMessagesLoading(false);
      }
    }
  }, []);

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setSelectedPost(null);
    await fetchMessages(conversation.conversationId);
  };

  const startConversation = async (post, initialMessage) => {
    try {
      setSending(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            senderName: displayName,
            postId: post.postId,
            initialMessage,
          }),
        }
      );

      const data = await parseResponse(res);

      setSelectedPost(post);
      setSelectedConversation(data.conversation);
      setSuccess("Conversation started.");

      await fetchConversations(true);
      await fetchMessages(data.conversation.conversationId, true);

      return data.conversation;
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not start conversation.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (
    conversationId,
    message,
    senderRole = userRole
  ) => {
    if (!conversationId || !message?.trim()) return;

    const clientMessageId = makeClientMessageId();

    const optimisticMessage = {
      conversationId,
      messageId: `temp-${clientMessageId}`,
      clientMessageId,
      senderId: userId,
      senderUserId: userId,
      senderName: displayName,
      senderRole,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      pending: true,
    };

    try {
      setSending(true);
      clearNotices();

      setMessages((prev) => [...prev, optimisticMessage]);

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/conversations/${encodeURIComponent(
          conversationId
        )}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            senderName: displayName,
            senderRole,
            message,
          }),
        }
      );

      await parseResponse(res);

      await fetchMessages(conversationId, true);
      await fetchConversations(true);
    } catch (err) {
      console.error(err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.clientMessageId === clientMessageId
            ? {
              ...msg,
              pending: false,
              failed: true,
            }
            : msg
        )
      );

      setError(err.message || "Could not send message.");
      throw err;
    } finally {
      setSending(false);
    }
  };

  // WebSocket typing is disabled because execute-api:ManageConnections is blocked.
  // Keep this function so existing components do not break.
  const sendTyping = () => { };

  const draftOpportunityPost = async (rawBrief, currentForm = {}) => {
    try {
      setAiLoading(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/ai/post-draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rawBrief,
            currentForm,
          }),
        }
      );

      const data = await parseResponse(res);
      return data.draft;
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not generate AI post draft.");
      return null;
    } finally {
      setAiLoading(false);
    }
  };



  const draftInitialMessage = async (
    post,
    intent = "ask about this opportunity"
  ) => {
    try {
      setAiLoading(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/ai/message-draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post,
            profile,
            displayName,
            intent,
          }),
        }
      );

      const data = await parseResponse(res);
      return data.message || "";
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not draft message.");
      return "";
    } finally {
      setAiLoading(false);
    }
  };

  const draftReplySuggestion = async (
    conversation,
    conversationMessages = [],
    instructions = ""
  ) => {
    try {
      setAiLoading(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/ai/reply-draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation,
            messages: conversationMessages,
            profile,
            displayName,
            currentUser: {
              userId,
              displayName,
              role: userRole,
            },
            instructions,
          }),
        }
      );

      return await parseResponse(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not suggest a reply.");
      return null;
    } finally {
      setAiLoading(false);
    }
  };
  const getBusinessVerification = async () => {
    try {
      clearNotices();

      const url = new URL(
        `${OPPORTUNITY_API}/opportunity-connect/business-verification`
      );

      url.searchParams.set("userId", userId);

      const res = await fetch(url.toString());
      return await parseResponse(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load business verification.");
      return null;
    }
  };

  const verifyBusiness = async ({ businessName, uen, businessAddress }) => {
    try {
      setAiLoading(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/business-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            businessName,
            uen,
            businessAddress,
          }),
        }
      );

      return await parseResponse(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not verify business.");
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const explainOpportunityMatch = async (post, matchInput = {}) => {
    try {
      setAiLoading(true);
      clearNotices();

      const res = await fetch(
        `${OPPORTUNITY_API}/opportunity-connect/ai/match-explanation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post,
            profile,
            matchInput,
          }),
        }
      );

      return await parseResponse(res);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not explain match.");
      return null;
    } finally {
      setAiLoading(false);
    }
  };



  // Initial page load
  useEffect(() => {
    fetchPosts();
    fetchConversations();
  }, [fetchPosts, fetchConversations]);

  // Poll selected conversation every 3 seconds.
  // This replaces WebSocket live push.
  useEffect(() => {
    if (!selectedConversation?.conversationId) return;

    const conversationId = selectedConversation.conversationId;

    const interval = setInterval(async () => {
      await fetchMessages(conversationId, true);
      await fetchConversations(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [
    selectedConversation?.conversationId,
    fetchMessages,
    fetchConversations,
  ]);

  return {
    userId,
    userRole,
    profile,
    displayName,

    posts,
    matches,
    conversations,
    selectedPost,
    selectedConversation,
    messages,

    postsLoading,
    matchesLoading,
    conversationsLoading,
    messagesLoading,
    posting,
    sending,
    aiLoading,

    socketStatus,
    typingText,

    error,
    success,

    setSelectedPost,
    setSelectedConversation,
    setMessages,
    clearNotices,

    fetchPosts,
    createPost,
    fetchMatches,
    fetchConversations,
    startConversation,
    selectConversation,
    fetchMessages,
    sendMessage,
    sendTyping,

    draftOpportunityPost,
    draftInitialMessage,
    draftReplySuggestion,
    explainOpportunityMatch,
    verifyBusiness,
    getBusinessVerification,
  };
}