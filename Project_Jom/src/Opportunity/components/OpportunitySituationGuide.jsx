import { useMemo, useState } from "react";
import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    HelpCircle,
    Loader2,
    MessageSquare,
    SearchCheck,
    Sparkles,
} from "lucide-react";

function rankPostsForSituation(posts, situation, answers) {
    if (!Array.isArray(posts)) return [];

    const situationText = [
        situation,
        ...Object.values(answers || {}),
    ]
        .join(" ")
        .toLowerCase();

    const hasPhysicalConstraint =
        situationText.includes("disability") ||
        situationText.includes("disabled") ||
        situationText.includes("cannot stand") ||
        situationText.includes("can't stand") ||
        situationText.includes("seated") ||
        situationText.includes("sit down") ||
        situationText.includes("low stamina") ||
        situationText.includes("wheelchair") ||
        situationText.includes("mobility") ||
        situationText.includes("cannot walk") ||
        situationText.includes("can't walk") ||
        situationText.includes("physical limitation");

    const needsRemote =
        situationText.includes("remote") ||
        situationText.includes("work from home") ||
        situationText.includes("home-based");

    const needsFlexible =
        situationText.includes("flexible") ||
        situationText.includes("short shift") ||
        situationText.includes("short shifts") ||
        situationText.includes("caregiver") ||
        situationText.includes("caring for");

    const isStudent =
        situationText.includes("student") ||
        situationText.includes("school") ||
        situationText.includes("after school");

    const needsUrgentPaid =
        situationText.includes("lost my job") ||
        situationText.includes("need income") ||
        situationText.includes("paid work") ||
        situationText.includes("urgent");

    const physicalBadKeywords = [
        "food preparation",
        "kitchen",
        "cafe service",
        "service crew",
        "retail floor",
        "cleaning",
        "delivery",
        "warehouse",
        "event setup",
        "stocking",
        "shelf",
        "shelves",
        "packing",
        "standing",
        "carry",
        "lifting",
        "runner",
        "booth",
    ];

    const seatedGoodKeywords = [
        "remote",
        "admin",
        "data entry",
        "form checking",
        "desk",
        "chat support",
        "phone support",
        "online",
        "coordinator",
        "tuition admin",
        "reception",
        "seated",
        "low physical",
        "document",
        "digital",
    ];

    return [...posts]
        .map((post) => {
            const combined = [
                post.title,
                post.description,
                Array.isArray(post.skills) ? post.skills.join(" ") : post.skills,
                post.location,
                post.availability,
                post.opportunityType,
                post.payRange,
            ]
                .join(" ")
                .toLowerCase();

            let score = 0;

            const hasPhysicalBad = physicalBadKeywords.some((word) =>
                combined.includes(word)
            );

            const hasSeatedGood = seatedGoodKeywords.some((word) =>
                combined.includes(word)
            );

            if (hasPhysicalConstraint) {
                if (hasSeatedGood) score += 80;
                if (hasPhysicalBad && !hasSeatedGood) score -= 200;
            }

            if (needsRemote) {
                if (combined.includes("remote") || combined.includes("online")) {
                    score += 50;
                } else {
                    score -= 30;
                }
            }

            if (needsFlexible) {
                if (
                    combined.includes("flexible") ||
                    combined.includes("short shift") ||
                    combined.includes("ad-hoc") ||
                    combined.includes("weekend") ||
                    combined.includes("evening")
                ) {
                    score += 30;
                }
            }

            if (isStudent) {
                if (
                    combined.includes("student") ||
                    combined.includes("evening") ||
                    combined.includes("weekend") ||
                    combined.includes("intern") ||
                    combined.includes("training") ||
                    combined.includes("part-time")
                ) {
                    score += 30;
                }
            }

            if (needsUrgentPaid) {
                if (
                    combined.includes("$") ||
                    combined.includes("paid") ||
                    combined.includes("per hour") ||
                    combined.includes("part-time")
                ) {
                    score += 30;
                }

                if (
                    combined.includes("volunteer") ||
                    combined.includes("volunteering") ||
                    combined.includes("unpaid")
                ) {
                    score -= 30;
                }
            }

            if (combined.includes("tampines")) score += 10;
            if (post.verificationStatus === "verified") score += 10;

            return {
                ...post,
                situationRankScore: score,
            };
        })
        .filter((post) => {
            if (hasPhysicalConstraint) {
                return post.situationRankScore > 0;
            }

            return true;
        })
        .sort((a, b) => b.situationRankScore - a.situationRankScore);
}

export default function OpportunitySituationGuide({
    posts,
    loading,
    onGenerateQuestions,
    onGenerateRecommendations,
    onMessage,
    onSelect,
}) {
    const [situation, setSituation] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [recommendations, setRecommendations] = useState([]);
    const [summary, setSummary] = useState("");
    const [stage, setStage] = useState("start");

    const visiblePosts = useMemo(() => {
        return rankPostsForSituation(posts, situation, answers).slice(0, 40);
    }, [posts, situation, answers]);

    const canAskQuestions = situation.trim().length >= 8;
    const hasQuestions = questions.length > 0;

    const handleAnalyseSituation = async () => {
        if (!canAskQuestions || !onGenerateQuestions) return;

        const result = await onGenerateQuestions(situation);

        if (!result) return;

        const nextQuestions = Array.isArray(result.questions)
            ? result.questions
            : [];

        setQuestions(nextQuestions);
        setAnswers({});
        setRecommendations([]);
        setSummary(result.situationSummary || "");
        setStage(nextQuestions.length > 0 ? "questions" : "recommendations");
    };

    const updateAnswer = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleRecommend = async () => {
        if (!onGenerateRecommendations) return;

        const formattedAnswers = questions.map((question) => ({
            id: question.id,
            question: question.question,
            answer: answers[question.id] || "",
        }));

        const result = await onGenerateRecommendations({
            situation,
            situationSummary: summary,
            answers: formattedAnswers,
            posts: visiblePosts,
        });

        if (!result) return;

        setRecommendations(
            Array.isArray(result.recommendations) ? result.recommendations : []
        );

        if (result.situationSummary) {
            setSummary(result.situationSummary);
        }

        setStage("recommendations");
    };

    const findOriginalPost = (recommendation) => {
        return posts.find((post) => post.postId === recommendation.postId);
    };

    const handleReset = () => {
        setSituation("");
        setQuestions([]);
        setAnswers({});
        setRecommendations([]);
        setSummary("");
        setStage("start");
    };

    return (
        <div className="opp-situation-layout">
            <div className="opp-situation-hero">
                <div>
                    <span className="opp-section-kicker">Situation Guide</span>
                    <h2>Start from your situation</h2>
                    <p>
                        Describe what you are facing. The assistant will ask a few follow-up
                        questions before recommending suitable opportunities.
                    </p>
                </div>

                <div className="opp-situation-hero-icon">
                    <Sparkles size={24} />
                </div>
            </div>

            <div className="opp-situation-card">
                <div className="opp-situation-step">
                    <span>1</span>
                    <div>
                        <h3>Describe your situation</h3>
                        <p>
                            You do not need to know the exact job title. Start with what
                            happened or what support you need.
                        </p>
                    </div>
                </div>

                <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    rows={5}
                    placeholder="Example: I recently lost my job and need flexible paid work near Tampines. I can work on weekends and have some customer service experience."
                />

                <div className="opp-situation-actions">
                    <button
                        type="button"
                        onClick={handleAnalyseSituation}
                        disabled={loading || !canAskQuestions}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={17} className="spin-icon" />
                                Analysing...
                            </>
                        ) : (
                            <>
                                <SearchCheck size={17} />
                                Analyse situation
                            </>
                        )}
                    </button>

                    {(hasQuestions || recommendations.length > 0) && (
                        <button type="button" className="secondary" onClick={handleReset}>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {summary && (
                <div className="opp-situation-summary-card">
                    <CheckCircle2 size={18} />
                    <div>
                        <strong>Situation summary</strong>
                        <p>{summary}</p>
                    </div>
                </div>
            )}

            {stage === "questions" && hasQuestions && (
                <div className="opp-situation-card">
                    <div className="opp-situation-step">
                        <span>2</span>
                        <div>
                            <h3>Answer a few follow-up questions</h3>
                            <p>
                                These help the assistant recommend opportunities that fit your
                                availability, needs and comfort level.
                            </p>
                        </div>
                    </div>

                    <div className="opp-question-list">
                        {questions.map((question, index) => (
                            <label key={question.id || index} className="opp-question-card">
                                <div>
                                    <HelpCircle size={17} />
                                    <strong>{question.question}</strong>
                                </div>

                                {Array.isArray(question.options) &&
                                    question.options.length > 0 ? (
                                    <select
                                        value={answers[question.id] || ""}
                                        onChange={(e) => updateAnswer(question.id, e.target.value)}
                                    >
                                        <option value="">Select an answer</option>
                                        {question.options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        value={answers[question.id] || ""}
                                        onChange={(e) => updateAnswer(question.id, e.target.value)}
                                        placeholder="Type your answer"
                                    />
                                )}
                            </label>
                        ))}
                    </div>

                    <div className="opp-situation-actions">
                        <button type="button" onClick={handleRecommend} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={17} className="spin-icon" />
                                    Finding...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={17} />
                                    Recommend opportunities
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {stage === "recommendations" && (
                <div className="opp-situation-card">
                    <div className="opp-situation-step">
                        <span>3</span>
                        <div>
                            <h3>Recommended opportunities</h3>
                            <p>
                                These suggestions are based on the situation, answers and
                                available verified opportunities.
                            </p>
                        </div>
                    </div>

                    {recommendations.length === 0 ? (
                        <div className="opp-empty-card">
                            <BriefcaseBusiness size={28} />
                            <h3>No strong recommendations yet</h3>
                            <p>
                                Try adding more details about availability, skills or preferred
                                type of work.
                            </p>
                        </div>
                    ) : (
                        <div className="opp-situation-recommendations">
                            {recommendations.map((item, index) => {
                                const originalPost = findOriginalPost(item);
                                const post = originalPost || item;

                                return (
                                    <article
                                        key={item.postId || `${item.title}-${index}`}
                                        className="opp-situation-recommendation-card"
                                    >
                                        <div className="opp-situation-rank">
                                            #{index + 1}
                                        </div>

                                        <div className="opp-situation-rec-content">
                                            <div className="opp-situation-rec-header">
                                                <div>
                                                    <h4>{item.title || post.title}</h4>
                                                    <p>
                                                        {item.businessName ||
                                                            post.businessName ||
                                                            "Opportunity poster"}
                                                    </p>
                                                </div>

                                                <span>{item.matchLevel || "Recommended"}</span>
                                            </div>

                                            <p className="opp-situation-rec-reason">
                                                {item.reason ||
                                                    "This opportunity may fit the described situation."}
                                            </p>

                                            {Array.isArray(item.nextSteps) &&
                                                item.nextSteps.length > 0 && (
                                                    <ul>
                                                        {item.nextSteps.slice(0, 3).map((step) => (
                                                            <li key={step}>{step}</li>
                                                        ))}
                                                    </ul>
                                                )}

                                            <div className="opp-situation-rec-meta">
                                                <span>{post.location || "Location not listed"}</span>
                                                <span>{post.availability || "Timing to confirm"}</span>
                                                <span>{post.payRange || "Pay/support to confirm"}</span>
                                            </div>

                                            <div className="opp-situation-rec-actions">
                                                <button
                                                    type="button"
                                                    className="secondary"
                                                    onClick={() => onSelect?.(post)}
                                                >
                                                    View details
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onMessage?.(post)}
                                                >
                                                    <MessageSquare size={16} />
                                                    Message poster
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {stage === "start" && (
                <div className="opp-situation-example-card">
                    <strong>Try situations like:</strong>
                    <div>
                        <button
                            type="button"
                            onClick={() =>
                                setSituation(
                                    "I recently lost my job and need flexible paid work near Tampines. I can work on weekends and I have basic customer service experience."
                                )
                            }
                        >
                            I lost my job
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setSituation(
                                    "I am a student looking for evening or weekend part-time work. I prefer something simple that does not require prior experience."
                                )
                            }
                        >
                            Student looking for work
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setSituation(
                                    "I am caring for a family member and need flexible work that is near home. I can only work short shifts."
                                )
                            }
                        >
                            Need flexible short shifts
                        </button>
                    </div>
                </div>
            )}

            {stage !== "start" && recommendations.length === 0 && (
                <div className="opp-situation-tip">
                    <ArrowRight size={16} />
                    <span>
                        Tip: answer as clearly as possible so the assistant can match timing,
                        skills and urgency.
                    </span>
                </div>
            )}
        </div>
    );
}