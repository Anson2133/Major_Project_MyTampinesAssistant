import { useState } from "react";
import { Building2, Loader2, ShieldCheck, Sparkles } from "lucide-react";

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
  aiLoading,
}) {
  const [form, setForm] = useState(initialForm);
  const [rawBrief, setRawBrief] = useState("");
  const [aiNotes, setAiNotes] = useState([]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyAiDraft = async () => {
    if (!rawBrief.trim() || !onDraftPost) return;

    const draft = await onDraftPost(rawBrief, form);

    if (!draft) return;

    setForm((prev) => ({
      ...prev,
      businessName: draft.businessName || prev.businessName,
      uen: draft.uen || prev.uen,
      businessAddress: draft.businessAddress || prev.businessAddress,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.declarationAccepted) {
      alert("Please accept the declaration before submitting.");
      return;
    }

    await onSubmit(form);

    setForm(initialForm);
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
            Businesses can submit opportunities for residents. AI can help turn
            a rough description into a structured post, but the business still
            reviews and submits it manually.
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
            placeholder="Example: I run a bakery in Tampines and need two weekend helpers from 9am to 2pm. Pay is $12 per hour. Need basic customer service."
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
          Business name
          <input
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="Example: Tampines Mini Mart"
            required
          />
        </label>

        <label>
          UEN number
          <input
            value={form.uen}
            onChange={(e) => updateField("uen", e.target.value)}
            placeholder="Example: 202312345A"
            required
          />
        </label>

        <label className="full">
          Business address
          <input
            value={form.businessAddress}
            onChange={(e) => updateField("businessAddress", e.target.value)}
            placeholder="Example: Tampines Street 21"
          />
        </label>

        <label>
          Contact person
          <input
            value={form.contactPerson}
            onChange={(e) => updateField("contactPerson", e.target.value)}
            placeholder="Example: Mr Tan"
            required
          />
        </label>

        <label>
          Contact email
          <input
            type="email"
            value={form.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            placeholder="contact@example.com"
          />
        </label>

        <label>
          Contact phone
          <input
            value={form.contactPhone}
            onChange={(e) => updateField("contactPhone", e.target.value)}
            placeholder="Example: 91234567"
          />
        </label>

        <label>
          Opportunity type
          <select
            value={form.opportunityType}
            onChange={(e) => updateField("opportunityType", e.target.value)}
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
            placeholder="Example: Part-time cashier needed"
            required
          />
        </label>

        <label className="full">
          Description
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
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
            placeholder="cashier, customer service, retail"
          />
        </label>

        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Tampines"
          />
        </label>

        <label>
          Availability
          <input
            value={form.availability}
            onChange={(e) => updateField("availability", e.target.value)}
            placeholder="Weekends, weekday evenings"
          />
        </label>

        <label>
          Pay range or support details
          <input
            value={form.payRange}
            onChange={(e) => updateField("payRange", e.target.value)}
            placeholder="$10 to $12 per hour"
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
          <span>Submissions are marked as pending verification.</span>
        </div>

        <button type="submit" disabled={posting}>
          {posting ? "Submitting..." : "Submit opportunity"}
        </button>
      </div>
    </form>
  );
}