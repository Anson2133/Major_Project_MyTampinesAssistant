import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileSearch,
  MapPinned,
  Megaphone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import HelpFaq from "../components/HelpFaq";
import useHelpDirectory from "../hooks/useHelpDirectory";

import "../help.css";

const tutorialSteps = [
  {
    id: "profile",
    icon: UserRound,
    title: "1. Review your profile",
    description:
      "Your saved profile helps the app understand broad context such as life stage, housing type, employment status, and support needs.",
    route: "/profile",
    buttonText: "View Profile",
    guide: [
      "Open the Profile page.",
      "Check that your basic information is correct.",
      "Review details such as housing type, employment status, and income band.",
      "Use this profile to receive more relevant service and policy suggestions.",
    ],
  },
  {
    id: "chat",
    icon: Bot,
    title: "2. Ask the AI Assistant if you are unsure where to start",
    description:
      "Use the chatbot when you know your situation but do not know the exact scheme, agency, or service name.",
    route: "/chat",
    buttonText: "Open Chatbot",
    guide: [
      "Open the Chatbot page.",
      "Describe your situation in your own words.",
      "For example, ask about medical bills, pregnancy support, job loss, or elderly care.",
      "The assistant can guide you to a relevant support category or service journey.",
    ],
  },
  {
    id: "services",
    icon: ClipboardList,
    title: "3. Use Services for a guided support journey",
    description:
      "Use the Services page when you want a structured flow that helps you browse categories, check possible eligibility, and prepare next steps.",
    route: "/services",
    buttonText: "Browse Services",
    guide: [
      "Choose a support category that matches your need.",
      "Select the type of support you are looking for.",
      "Review recommended services based on your saved profile.",
      "Check likely eligibility, required documents, and official next steps.",
    ],
  },
  {
    id: "scanner",
    icon: FileSearch,
    title: "4. Scan a document when you do not know what it means",
    description:
      "Upload a letter, screenshot, bill, receipt, or notice. The scanner helps explain the document, check possible scam risk, and connect it to a support pathway where appropriate.",
    route: "/document-scanner",
    buttonText: "Open Scanner",
    guide: [
      "Upload a PDF, image, screenshot, bill, letter, receipt, or notice.",
      "The app extracts and summarises the document content.",
      "Review the scam risk result.",
      "Check whether a related support pathway is suggested.",
      "Continue to the related service journey or official source if needed.",
    ],
  },
  {
    id: "policy-watch",
    icon: Megaphone,
    title: "5. Check Policy Watch for new support updates",
    description:
      "Policy Watch shows support-related announcements, reminders, and official-source updates that may affect residents.",
    route: "/announcements",
    buttonText: "Open Policy Watch",
    guide: [
      "Browse latest support updates and announcements.",
      "Filter updates by category if needed.",
      "Watch categories or sources that are relevant to you.",
      "Pin important notices so you can return to them later.",
      "Look out for the red dot when there are new watched updates.",
    ],
  },
  {
    id: "booking",
    icon: MapPinned,
    title: "6. Use Booking when location matters",
    description:
      "Use the Booking page when you need to see nearby service points, clinics, centres, or physical locations for in-person support.",
    route: "/booking",
    buttonText: "Open Booking",
    guide: [
      "Open the Booking page.",
      "View available service locations on the map.",
      "Select a nearby support point, clinic, or centre.",
      "Use the location details to decide where to visit or book.",
    ],
  },
];

const helpCards = [
  {
    title: "Find direct contacts",
    description:
      "Use the Directory when you already know the issue and want official links, hotlines, agency pages, or reporting channels.",
    route: "/directory",
    buttonText: "Open Directory",
    icon: Search,
  },
  {
    title: "Understand recommendations safely",
    description:
      "The app helps estimate relevant support, but final eligibility and approval always depend on the official agency or service provider.",
    route: "/services",
    buttonText: "Check Services",
    icon: ShieldCheck,
  },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [openGuideId, setOpenGuideId] = useState(null);

  const { helpFaqs, openFaqIndex, toggleFaq } = useHelpDirectory();

  const toggleGuide = (stepId) => {
    setOpenGuideId((current) => (current === stepId ? null : stepId));
  };

  return (
    <main className="help-page">
      <section className="help-hero">
        <div>
          <span className="help-eyebrow">Help Centre</span>

          <h1>How to use MyTampines Assistant</h1>

          <p>
            Learn how to use the chatbot, services journey, document scanner,
            Policy Watch, booking map, and directory. This page also answers
            common questions about recommendations, eligibility, and safety.
          </p>
        </div>

        <div className="help-hero-card">
          <ShieldCheck size={28} />

          <div>
            <strong>Recommended flow</strong>
            <p>
              Start with your profile, describe your situation, check services,
              prepare documents, and use official links for final action.
            </p>
          </div>
        </div>
      </section>

      <section className="help-quick-actions">
        {helpCards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.title}
              type="button"
              className="help-quick-card"
              onClick={() => navigate(card.route)}
            >
              <div className="help-quick-icon">
                <Icon size={24} />
              </div>

              <div>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <span>{card.buttonText}</span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="help-directory-section">
        <div className="help-section-header">
          <div>
            <span className="help-section-kicker">Tutorial</span>

            <h2>Step-by-step guide</h2>

            <p>
              Follow this guide if you are unsure which feature to use first.
              Each part of the app supports a different stage of the resident
              support journey.
            </p>
          </div>
        </div>

        <div className="help-tutorial-list">
          {tutorialSteps.map((step) => {
            const Icon = step.icon;
            const isOpen = openGuideId === step.id;

            return (
              <article className="help-tutorial-card" key={step.id}>
                <div className="help-directory-icon">
                  <Icon size={22} />
                </div>

                <div className="help-tutorial-content">
                  <div className="help-tutorial-top-row">
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>

                    <button
                      type="button"
                      className="help-guide-toggle"
                      onClick={() => toggleGuide(step.id)}
                    >
                      {isOpen ? "Hide guide" : "View guide"}
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {isOpen && (
                    <div className="help-simple-guide">
                      <strong>How it works</strong>

                      <ul>
                        {step.guide.map((item) => (
                          <li key={item}>
                            <CheckCircle2 size={16} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    type="button"
                    className="help-secondary-btn"
                    onClick={() => navigate(step.route)}
                  >
                    {step.buttonText}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <HelpFaq
        faqs={helpFaqs}
        openFaqIndex={openFaqIndex}
        toggleFaq={toggleFaq}
      />
    </main>
  );
}