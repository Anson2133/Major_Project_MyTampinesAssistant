import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const initialForm = {
  businessName: "",
  uen: "",
  businessAddress: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  title: "",
  description: "",
  skills: "",
  location: "Tampines",
  availability: "",
  payRange: "",
  opportunityType: "Part-time work",
  declarationAccepted: false,
};

export default function OpportunityPostForm({
  onSubmit,
  posting,
  onDraftPost,
  onVerifyBusiness,
  onGetBusinessVerification,
  aiLoading,
}) {
  const [form, setForm] = useState(initialForm);
  const [rawBrief, setRawBrief] = useState("");
  const [aiNotes, setAiNotes] = useState([]);
  const [businessVerification, setBusinessVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [loadingSavedVerification, setLoadingSavedVerification] =
    useState(false);

  const isVerified = businessVerification?.verificationStatus === "verified";

  useEffect(() => {
    let cancelled = false;

    const loadSavedVerification = async () => {
      if (!onGetBusinessVerification) return;

      try {
        setLoadingSavedVerification(true);

        const result = await onGetBusinessVerification();

        if (cancelled) return;

        const saved = result?.businessVerification;

        if (saved?.verificationStatus === "verified") {
          setBusinessVerification(saved);

          setForm((prev) => ({
            ...prev,
            businessName: saved.businessName || prev.businessName,
            uen: saved.uen || prev.uen,
            businessAddress: saved.businessAddress || prev.businessAddress,
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingSavedVerification(false);
        }
      }
    };

    loadSavedVerification();

    return () => {
      cancelled = true;
    };
  }, [onGetBusinessVerification]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (
      field === "businessName" ||
      field === "uen" ||
      field === "businessAddress"
    ) {
      setBusinessVerification(null);
    }
  };

  const applyAiDraft = async () => {
    if (!rawBrief.trim() || !onDraftPost) return;

    const draft = await onDraftPost(rawBrief, form);
    if (!draft) return;

    setForm((prev) => ({
      ...prev,

      businessName: prev.businessName,
      uen: prev.uen,
      businessAddress: prev.businessAddress,

      contactPerson: draft.contactPerson || prev.contactPerson,
      contactEmail: draft.contactEmail || prev.contactEmail,
      contactPhone: draft.contactPhone || prev.contactPhone,
      title: draft.title || prev.title,
      description: draft.description || prev.description,
      skills: Array.isArray(draft.skills)
        ? draft.skills.filter(Boolean).join(", ")
        : prev.skills,
      location: draft.location || prev.location,
      availability: draft.availability || prev.availability,
      payRange: draft.payRange || prev.payRange,
      opportunityType: draft.opportunityType || prev.opportunityType,
    }));

    setAiNotes(Array.isArray(draft.safetyNotes) ? draft.safetyNotes : []);
  };

  const handleVerifyBusiness = async () => {
    if (!form.businessName.trim() || !form.uen.trim()) {
      alert("Please enter both business name and UEN number first.");
      return;
    }

    if (!onVerifyBusiness) {
      alert("Business verification is not connected yet.");
      return;
    }

    try {
      setVerifying(true);

      const result = await onVerifyBusiness({
        businessName: form.businessName,
        uen: form.uen,
        businessAddress: form.businessAddress,
      });

      if (result) {
        setBusinessVerification(result);

        if (result.verificationStatus === "verified") {
          setForm((prev) => ({
            ...prev,
            businessName: result.businessName || prev.businessName,
            uen: result.uen || prev.uen,
            businessAddress: result.businessAddress || prev.businessAddress,
          }));
        }
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isVerified) {
      alert("Please verify the business before submitting the opportunity.");
      return;
    }

    if (!form.declarationAccepted) {
      alert("Please accept the declaration before submitting.");
      return;
    }

    await onSubmit({
      ...form,
      businessVerification,
      verificationStatus: "verified",
      verificationBadges: ["Verified Business"],
    });

    setForm((prev) => ({
      ...initialForm,
      businessName: prev.businessName,
      uen: prev.uen,
      businessAddress: prev.businessAddress,
    }));

    setRawBrief("");
    setAiNotes([]);
  };

  return (
    <form className="opp-form-card" onSubmit={handleSubmit}>
      <div className="opp-form-header">
        <div className="opp-form-icon">
          <Building2 size={24} />
        </div>

        <div>
          <span className="opp-section-kicker">Business submission</span>
          <h2>Post a local opportunity</h2>
          <p>
            Verify your business once. After verification, you can create and
            submit opportunities under this business account.
          </p>
        </div>
      </div>

      <div className={`opp-business-gate-card ${isVerified ? "verified" : ""}`}>
        <div className="opp-business-gate-header">
          <div>
            <span className="opp-section-kicker">Business verification</span>
            <h3>
              {isVerified ? form.businessName : "Verify business account"}
            </h3>
            <p>
              {isVerified
                ? "This business account is verified and ready to post opportunities."
                : "Enter your registered business name and UEN to continue."}
            </p>
          </div>

          {isVerified && (
            <span className="opp-verified-inline-badge">
              <CheckCircle2 size={15} />
              Verified Business
            </span>
          )}
        </div>

        {loadingSavedVerification ? (
          <div className="opp-verification-loading">
            <Loader2 size={18} className="spin-icon" />
            Checking business verification...
          </div>
        ) : (
          <>
            {!isVerified && (
              <>
                <div className="opp-verify-grid">
                  <label>
                    Business name
                    <input
                      value={form.businessName}
                      onChange={(e) =>
                        updateField("businessName", e.target.value)
                      }
                      placeholder="Registered business name"
                    />
                  </label>

                  <label>
                    UEN number
                    <input
                      value={form.uen}
                      onChange={(e) =>
                        updateField("uen", e.target.value.toUpperCase())
                      }
                      placeholder="UEN number"
                    />
                  </label>

                  <label className="full">
                    Business address
                    <input
                      value={form.businessAddress}
                      onChange={(e) =>
                        updateField("businessAddress", e.target.value)
                      }
                      placeholder="Business address"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="opp-verify-main-btn"
                  onClick={handleVerifyBusiness}
                  disabled={
                    verifying ||
                    !form.businessName.trim() ||
                    !form.uen.trim()
                  }
                >
                  {verifying ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      Verify business
                    </>
                  )}
                </button>
              </>
            )}

            {businessVerification && (
              <div
                className={`opp-verification-message ${
                  isVerified ? "success" : "error"
                }`}
              >
                <strong>
                  {isVerified ? "Business verified" : "Verification failed"}
                </strong>
                <p>{businessVerification.summary}</p>
              </div>
            )}
          </>
        )}
      </div>

      {isVerified && (
        <>
          <div className="opp-form-unlocked-card">
            <div>
              <span className="opp-section-kicker">Opportunity details</span>
              <h3>Create opportunity post</h3>
              <p>
                Your verified business details will be attached to this post.
              </p>
            </div>
          </div>

          <div className="opp-ai-draft-box">
            <label>
              AI autofill from rough description
              <textarea
                value={rawBrief}
                onChange={(e) => setRawBrief(e.target.value)}
                rows={4}
                placeholder="Describe the role, timing, location, pay and required skills."
              />
            </label>

            <button
              type="button"
              className="opp-ai-button"
              onClick={applyAiDraft}
              disabled={aiLoading || !rawBrief.trim()}
            >
              {aiLoading ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Auto-fill post
                </>
              )}
            </button>

            {aiNotes.length > 0 && (
              <div className="opp-ai-notes">
                <strong>AI notes</strong>
                <ul>
                  {aiNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="opp-form-grid">
            <label>
              Contact person
              <input
                value={form.contactPerson}
                onChange={(e) =>
                  updateField("contactPerson", e.target.value)
                }
                placeholder="Contact person"
                required
              />
            </label>

            <label>
              Contact email
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  updateField("contactEmail", e.target.value)
                }
                placeholder="Contact email"
              />
            </label>

            <label>
              Contact phone
              <input
                value={form.contactPhone}
                onChange={(e) =>
                  updateField("contactPhone", e.target.value)
                }
                placeholder="Contact phone"
              />
            </label>

            <label>
              Opportunity type
              <select
                value={form.opportunityType}
                onChange={(e) =>
                  updateField("opportunityType", e.target.value)
                }
              >
                <option>Part-time work</option>
                <option>Full-time work</option>
                <option>Short-term support</option>
                <option>Community volunteering</option>
                <option>Training opportunity</option>
              </select>
            </label>

            <label className="full">
              Opportunity title
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Opportunity title"
                required
              />
            </label>

            <label className="full">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Describe the role, working hours, support needed, and who may be suitable."
                rows={5}
                required
              />
            </label>

            <label>
              Skills needed
              <input
                value={form.skills}
                onChange={(e) => updateField("skills", e.target.value)}
                placeholder="Skills separated by commas"
              />
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Location"
              />
            </label>

            <label>
              Availability
              <input
                value={form.availability}
                onChange={(e) =>
                  updateField("availability", e.target.value)
                }
                placeholder="Availability"
              />
            </label>

            <label>
              Pay range or support details
              <input
                value={form.payRange}
                onChange={(e) => updateField("payRange", e.target.value)}
                placeholder="Pay range or support details"
              />
            </label>
          </div>

          <label className="opp-declaration">
            <input
              type="checkbox"
              required
              checked={form.declarationAccepted}
              onChange={(e) =>
                updateField("declarationAccepted", e.target.checked)
              }
            />
            <span>
              I confirm that the information provided is accurate and that this
              opportunity is suitable for public listing on a resident support
              platform.
            </span>
          </label>

          <div className="opp-form-footer">
            <div className="opp-safety-note">
              <ShieldCheck size={18} />
              <span>Verified Business. Ready to submit.</span>
            </div>

            <button type="submit" disabled={posting}>
              {posting ? "Submitting..." : "Submit opportunity"}
            </button>
          </div>
        </>
      )}
    </form>
  );
}