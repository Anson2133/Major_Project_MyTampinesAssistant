export const helpQuickActions = [
  {
    id: "chatbot",
    title: "Ask AI Assistant",
    description:
      "Ask questions in plain English if you are unsure which service or agency to approach.",
    buttonText: "Open Chatbot",
    route: "/chat",
  },
  {
    id: "services",
    title: "Find Services",
    description:
      "Use your saved profile to estimate relevant schemes, eligibility, documents, and next steps.",
    buttonText: "Browse Services",
    route: "/services",
  },
  {
    id: "scanner",
    title: "Scan a Document",
    description:
      "Upload a letter, screenshot, receipt, or notice to understand what it is and what to do next.",
    buttonText: "Open Scanner",
    route: "/document-scanner",
  },
];

export const helpCategories = [
  "All",
  "Emergency",
  "Scams & Safety",
  "Municipal Issues",
  "Estate & Housing",
  "Financial Support",
  "Healthcare",
  "Elderly & Caregiving",
  "Disability Support",
  "Employment & Skills",
  "Childcare & Education",
  "Education",
];

export const helpDirectory = [
  {
    id: "emergency",
    name: "Emergency Services",
    category: "Emergency",
    priority: 1,
    description:
      "For immediate danger, urgent medical emergencies, fire, crime, or life-threatening situations.",
    phone: "995 / 999",
    website: "",
    address: "",
    openingHours: "24 hours",
    tags: ["emergency", "ambulance", "police", "fire", "urgent"],
    relatedRoute: "",
    actionText: "Call immediately",
    note: "Use only for urgent emergencies.",
  },
  {
    id: "scamshield",
    name: "ScamShield / Scam Reporting",
    category: "Scams & Safety",
    priority: 2,
    description:
      "For suspected scam SMS, calls, suspicious links, fake government messages, or scam-related concerns.",
    phone: "Check official ScamShield / Police channels",
    website: "https://www.scamshield.gov.sg",
    address: "",
    openingHours: "Online resources available anytime",
    tags: ["scam", "fraud", "suspicious message", "sms", "phishing", "police"],
    relatedRoute: "/document-scanner",
    actionText: "Scan suspicious message",
    note: "Use Document Scanner if you have a suspicious message, screenshot, or letter.",
  },
  {
    id: "oneservice",
    name: "OneService App",
    category: "Municipal Issues",
    priority: 3,
    description:
      "Report municipal issues such as pests, cleanliness, faulty lights, illegal parking, damaged facilities, and estate matters.",
    phone: "Use OneService app / website",
    website: "https://www.oneservice.gov.sg",
    address: "",
    openingHours: "Online reporting available anytime",
    tags: [
      "municipal",
      "report",
      "pest",
      "cleanliness",
      "street light",
      "parking",
      "estate",
    ],
    relatedRoute: "",
    actionText: "Open reporting portal",
    note: "Good for routing feedback to the correct government agency.",
  },
  {
    id: "tampines-town-council",
    name: "Tampines Town Council",
    category: "Estate & Housing",
    priority: 4,
    description:
      "For HDB estate maintenance, common area issues, bulky item removal, cleanliness, lift/common corridor issues, and town council matters.",
    phone: "Replace with verified official number",
    website: "https://www.tampines.org.sg",
    address: "Tampines Town Council office / service centres",
    openingHours: "Check official website",
    tags: [
      "town council",
      "hdb",
      "bulky item",
      "estate",
      "corridor",
      "cleanliness",
      "maintenance",
      "lift",
    ],
    relatedRoute: "",
    actionText: "View estate help",
    note: "Replace contact details with your verified source before final demo.",
  },
  {
    id: "supportgowhere",
    name: "SupportGoWhere",
    category: "Financial Support",
    priority: 5,
    description:
      "A government portal to find support schemes, grants, vouchers, and assistance based on resident needs.",
    phone: "Use official portal",
    website: "https://supportgowhere.life.gov.sg",
    address: "",
    openingHours: "Online portal available anytime",
    tags: [
      "financial",
      "support",
      "grant",
      "voucher",
      "assistance",
      "low income",
      "help",
    ],
    relatedRoute: "/services/financial-support",
    actionText: "Check related services",
    note: "Use your Services page for a guided profile-based journey.",
  },
  {
    id: "cdc-vouchers",
    name: "CDC Vouchers",
    category: "Financial Support",
    priority: 6,
    description:
      "Digital vouchers for Singaporean households to use at participating merchants, hawkers, and supermarkets.",
    phone: "Use official CDC vouchers portal",
    website: "https://vouchers.cdc.gov.sg",
    address: "",
    openingHours: "Online claiming available anytime",
    tags: ["cdc", "voucher", "vouchers", "merchant", "hawker", "supermarket"],
    relatedRoute: "/services/financial-support",
    actionText: "Check related services",
    note: "Residents should always use the official portal and avoid suspicious voucher links.",
  },
  {
    id: "chas",
    name: "CHAS",
    category: "Healthcare",
    priority: 7,
    description:
      "Healthcare subsidies for eligible Singapore Citizens at participating CHAS GP and dental clinics.",
    phone: "Replace with verified official number",
    website: "https://www.chas.sg",
    address: "Participating CHAS clinics islandwide",
    openingHours: "Depends on clinic",
    tags: ["chas", "clinic", "healthcare", "medical", "dental", "subsidy"],
    relatedRoute: "/services/healthcare-services",
    actionText: "Check healthcare services",
    note: "Use the official CHAS clinic locator for participating clinics.",
  },
  {
    id: "healthhub",
    name: "HealthHub",
    category: "Healthcare",
    priority: 8,
    description:
      "Book and manage public healthcare appointments, view health records, and access Singapore healthcare e-services.",
    phone: "Use official HealthHub support channels",
    website: "https://www.healthhub.sg",
    address: "",
    openingHours: "Online services available anytime",
    tags: ["healthhub", "appointment", "polyclinic", "hospital", "health"],
    relatedRoute: "/services/healthcare-services",
    actionText: "Check healthcare services",
    note: "Useful for appointment-related questions.",
  },
  {
    id: "aic",
    name: "Agency for Integrated Care",
    category: "Elderly & Caregiving",
    priority: 9,
    description:
      "Support for seniors, caregivers, long-term care, home care, day care, and care navigation.",
    phone: "Replace with verified official number",
    website: "https://www.aic.sg",
    address: "AIC Link locations islandwide",
    openingHours: "Check official website",
    tags: [
      "elderly",
      "senior",
      "caregiver",
      "home care",
      "day care",
      "long term care",
      "aic",
    ],
    relatedRoute: "/services/elderly-support",
    actionText: "Check elderly services",
    note: "Good starting point for senior and caregiver support.",
  },
  {
    id: "sg-enable",
    name: "SG Enable",
    category: "Disability Support",
    priority: 10,
    description:
      "Support for persons with disabilities, caregivers, assistive technology, employment support, and inclusion programmes.",
    phone: "Replace with verified official number",
    website: "https://www.sgenable.sg",
    address: "",
    openingHours: "Check official website",
    tags: [
      "disability",
      "mobility",
      "special needs",
      "assistive technology",
      "wheelchair",
      "caregiver",
    ],
    relatedRoute: "/services/healthcare-services",
    actionText: "Check disability services",
    note: "Useful for assistive technology and disability-related support.",
  },
  {
    id: "skillsfuture",
    name: "SkillsFuture",
    category: "Employment & Skills",
    priority: 11,
    description:
      "Skills upgrading, training courses, career development, and lifelong learning support.",
    phone: "Use official SkillsFuture support channels",
    website: "https://www.skillsfuture.gov.sg",
    address: "",
    openingHours: "Online portal available anytime",
    tags: ["skillsfuture", "training", "course", "career", "upskill", "job"],
    relatedRoute: "/services/employment-skills",
    actionText: "Check employment services",
    note: "Useful for training and course-related support.",
  },
  {
    id: "ecda",
    name: "Early Childhood Development Agency",
    category: "Childcare & Education",
    priority: 12,
    description:
      "Information on childcare, infant care, preschool, subsidies, and early childhood services.",
    phone: "Use official ECDA contact channels",
    website: "https://www.ecda.gov.sg",
    address: "",
    openingHours: "Check official website",
    tags: [
      "childcare",
      "infant care",
      "preschool",
      "kindergarten",
      "subsidy",
      "child",
    ],
    relatedRoute: "/services/childcare-education-support",
    actionText: "Check childcare services",
    note: "Useful for preschool and childcare subsidy information.",
  },
  {
    id: "moe-fas",
    name: "MOE Financial Assistance",
    category: "Education",
    priority: 13,
    description:
      "Education-related financial assistance for eligible students in government or government-aided schools.",
    phone: "Contact the student’s school general office",
    website: "https://www.moe.gov.sg",
    address: "",
    openingHours: "School office hours",
    tags: ["moe", "school", "student", "fas", "education", "bursary"],
    relatedRoute: "/services/education-support",
    actionText: "Check education services",
    note: "Applications are usually handled through the student’s school.",
  },
];

export const helpFaqs = [
  {
    question: "What is MyTampines Assistant for?",
    answer:
      "MyTampines Assistant helps residents find government, healthcare, and community support more easily. It brings together chatbot guidance, service journeys, document scanning, policy updates, booking locations, and a directory into one platform.",
  },
  {
    question: "How is this different from searching online myself?",
    answer:
      "A normal search often gives many links and expects the user to know what to search for. This app lets users describe their situation, checks profile-based context, suggests possible support pathways, prepares document checklists, and points users to clearer next steps.",
  },
  {
    question: "When should I use the Chatbot?",
    answer:
      "Use the Chatbot when you are unsure where to start. You can describe your situation naturally, such as needing help with medical bills, employment, elderly care, childcare, pregnancy-related support, or financial support.",
  },
  {
    question: "When should I use the Services page?",
    answer:
      "Use the Services page when you want a guided journey. It helps you browse support categories, compare relevant services, estimate possible eligibility, view required documents, and understand what to do next.",
  },
  {
    question: "When should I use the Document Scanner?",
    answer:
      "Use the Document Scanner when you have a letter, bill, screenshot, notice, receipt, or message and want the app to help explain it, identify possible scam risk, and link it to a relevant support pathway.",
  },
  {
    question: "Does the Document Scanner only work for government letters?",
    answer:
      "No. It can be used for different document types such as screenshots, notices, bills, receipts, or messages. However, the app should only suggest support services when the document is actually related to a support need.",
  },
  {
    question: "What is Policy Watch?",
    answer:
      "Policy Watch shows support-related announcements, reminders, and official-source updates. It helps residents stay aware of changes that may affect healthcare, financial support, elderly care, employment, education, family support, or community services.",
  },
  {
    question: "What does Watch Category mean in Policy Watch?",
    answer:
      "Watching a category means the app tracks future updates from that support area, such as Healthcare or Financial Support. If a new matching update appears, the Announcements tab can show a red dot.",
  },
  {
    question: "What does Pin Notice mean?",
    answer:
      "Pin Notice saves one specific announcement so you can return to it later. It is like a bookmark. Pinning a notice is different from watching a category for future updates.",
  },
  {
    question: "What is the Booking page for?",
    answer:
      "The Booking page helps users see service locations on a map. It is useful when the next step requires visiting a centre, clinic, or support point in person.",
  },
  {
    question: "What is the Directory page for?",
    answer:
      "The Directory page is for direct contact information and official links. Use it when you already know the type of issue and want to find the correct agency, website, or reporting channel quickly.",
  },
  {
    question: "Are the eligibility results final?",
    answer:
      "No. Eligibility results are only estimates based on available profile information and user answers. Final approval always depends on the official agency or service provider.",
  },
  {
    question: "Why does the app ask extra questions sometimes?",
    answer:
      "Some services need information that may not be available in the saved profile. Extra questions help refine the match and reduce the chance of showing unsuitable services.",
  },
  {
    question: "Does the app submit applications for me?",
    answer:
      "No. The app helps users understand services, prepare documents, and find the correct next step. Applications should still be completed through official agency websites or approved channels.",
  },
  {
    question: "Can the app tell me what policies apply if I only describe my situation?",
    answer:
      "Yes, that is one of the intended improvements. For example, a user could say “I am pregnant” or “I lost my job”, and the system can suggest relevant policies, schemes, or support pathways without the user needing to know the exact scheme name.",
  },
  {
    question: "How does the app use my profile?",
    answer:
      "The profile helps the app personalise service suggestions and policy updates. For example, age band, housing type, employment status, income band, or family situation may affect which support areas are more relevant.",
  },
  {
    question: "Does the app store sensitive information?",
    answer:
      "The app should avoid storing unnecessary confidential information. The goal is to use minimal profile fields needed for matching, such as broad income band or housing type, rather than highly sensitive details.",
  },
  {
    question: "What should I do if I suspect a scam?",
    answer:
      "Do not click suspicious links or share personal details. Use official channels such as ScamShield or Police resources. You can also use the Document Scanner to check suspicious messages or screenshots.",
  },
  {
    question: "Why does the app still link to official websites?",
    answer:
      "Official websites are still necessary because final applications, eligibility checks, and approvals must come from the relevant agency. The app’s role is to reduce confusion before users reach that stage.",
  },
  {
    question: "Who is this app mainly designed for?",
    answer:
      "It is designed for residents who may not know which agency or scheme to approach, especially when they are dealing with fragmented services across government, healthcare, and community support.",
  },
];
