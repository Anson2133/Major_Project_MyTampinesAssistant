export const adminOverviewData = {
  generatedAt: "2026-05-18T20:00:00+08:00",

  kpis: [
    {
      id: "profiles",
      label: "Anonymised Profiles",
      value: "1,000",
      change: "+750 from original dataset",
      tone: "blue",
      description: "Privacy-safe resident profiles grouped by segment.",
    },
    {
      id: "interactions",
      label: "Service Interactions",
      value: "5,000",
      change: "Expanded demo activity",
      tone: "red",
      description: "Aggregated service, chatbot, scanner, and policy events.",
    },
    {
      id: "topCategory",
      label: "Top Support Category",
      value: "Financial Support",
      change: "Highest demand",
      tone: "orange",
      description: "Most frequent category across resident journeys.",
    },
    {
      id: "highestFriction",
      label: "Highest Friction Service",
      value: "CHAS",
      change: "Needs clearer guidance",
      tone: "purple",
      description: "High interest but lower next-step completion.",
    },
    {
      id: "policyGaps",
      label: "Potential Policy Gaps",
      value: "3",
      change: "Detected from interaction patterns",
      tone: "green",
      description: "High demand areas with weak completion signals.",
    },
    {
      id: "outreach",
      label: "Top Outreach Opportunity",
      value: "Senior Healthcare",
      change: "Priority segment",
      tone: "yellow",
      description: "Seniors show longer healthcare support journeys.",
    },
  ],

  headlineInsight:
    "Financial Support shows the highest overall demand, while Healthcare and Elderly Support show longer session times. This suggests residents may need clearer eligibility explanations, simpler document checklists, and more guided next steps.",

  demandSnapshot: [
    {
      category: "Financial Support",
      interactions: 1420,
      percentage: 28,
      signal: "High demand",
    },
    {
      category: "Healthcare",
      interactions: 1085,
      percentage: 22,
      signal: "Longer reading time",
    },
    {
      category: "Elderly Support",
      interactions: 830,
      percentage: 17,
      signal: "High friction",
    },
    {
      category: "Employment & Skills",
      interactions: 610,
      percentage: 12,
      signal: "Moderate demand",
    },
    {
      category: "Education & Childcare",
      interactions: 560,
      percentage: 11,
      signal: "Parent segment",
    },
    {
      category: "Community & Safety",
      interactions: 495,
      percentage: 10,
      signal: "Scanner-linked",
    },
  ],

  priorityFindings: [
    {
      title: "Healthcare journeys need clearer explanation",
      detail:
        "Senior users spend longer on healthcare-related services and frequently move between CHAS, HealthHub, and AIC-related guidance.",
      recommendation:
        "Surface eligibility, clinic locator actions, and document requirements earlier in the healthcare journey.",
    },
    {
      title: "Financial support demand is broad but fragmented",
      detail:
        "Lower-income households show high interaction with vouchers, rebates, and assistance schemes across multiple entry points.",
      recommendation:
        "Create a simpler urgent-support triage flow for residents unsure where to begin.",
    },
    {
      title: "Document scanning reveals support confusion",
      detail:
        "Scanned bills, official-looking letters, and scam-like messages often lead residents into support or safety-related pathways.",
      recommendation:
        "Use scanner classification to guide users directly to relevant help while keeping document contents private.",
    },
  ],
};