const facilitiesData = [
  // POLYCLINICS

  {
    id: 1,
    name: "Tampines Polyclinic",
    type: "Healthcare",
    category: "polyclinic",
    address: "1 Tampines Street 41, Singapore 529203",
    lat: 1.3530,
    lng: 103.9448,
    description:
      "General outpatient services, vaccinations, chronic disease management and health screenings.",
    openingHours:
      "Mon–Fri: 8am–4:30pm | Sat: 8am–12:30pm | Sun & PH: Closed",
    requirements:
      "Download the HealthBuddy app and log in with Singpass to make, change or cancel appointments. Website can be used to request, view, change or cancel appointments",
    cost: "Consultation and treatment fees vary by service.",
    bookingLink:
      "https://polyclinic.singhealth.com.sg/appointments",
    websiteName: "SingHealth Polyclinics",
    phone: "6783 6680",
    filter: "Healthcare",
    sport: null
  },

  {
    id: 2,
    name: "Tampines North Polyclinic",
    type: "Healthcare",
    category: "polyclinic",
    address: "35 Tampines Street 61, Singapore 528566",
    lat: 1.3712,
    lng: 103.9554,
    description:
      "General outpatient services, vaccinations, chronic disease management and health screenings.",
    openingHours:
      "Mon–Fri: 8am–4:30pm | Sat: 8am–12:30pm | Sun & PH: Closed",
    requirements:
      "Download the HealthBuddy app and log in with Singpass to make, change or cancel appointments.",
    cost: "Consultation and treatment fees vary by service.",
    bookingLink:
      "https://polyclinic.singhealth.com.sg/appointments",
    websiteName: "SingHealth Polyclinics",
    phone: "6322 7681",
    filter: "Healthcare",
    sport: null
  },

  // SPORTS

  {
    id: 3,
    name: "Badminton @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "1 Tampines Walk, Singapore 528523",
    lat: 1.3529,
    lng: 103.9449,
    description:
      "Indoor badminton courts at Our Tampines Hub Community Auditorium.",
    openingHours:
      "Daily: 7am–9pm",
    requirements:
      "ActiveSG account and Singpass login required. Maximum 2 slots per day.",
    cost:
      "SC/PR: $3.50 non-peak | $7.40 peak per hour per court",
    bookingLink:
      "https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues?postal-code=tampines",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Badminton"
  },

  {
    id: 4,
    name: "Badminton @ Tampines East CC",
    type: "Sports",
    category: "sports",
    address: "10 Tampines Street 23, Singapore 529341",
    lat: 1.3566,
    lng: 103.9431,
    description:
      "Community club badminton courts available for booking.",
    openingHours:
      "Non-Peak: 10am–5pm | Peak: 6pm–8pm",
    requirements:
      "Book through OnePA and log in with Singpass.",
    cost:
      "$5–$6 non-peak | $6–$7 peak per slot",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesEastCC_BADMINTONCOURTS",
    websiteName: "OnePA",
    phone: "6786 3227",
    filter: "Sports",
    sport: "Badminton"
  },

  {
    id: 5,
    name: "Badminton @ Tampines Changkat CC",
    type: "Sports",
    category: "sports",
    address: "13 Tampines Street 11, #01-01, Singapore 529453",
    lat: 1.3489,
    lng: 103.9412,
    description:
      "Indoor badminton courts at Tampines Changkat CC.",
    openingHours:
      "Non-Peak: 10:30am–5:30pm | Peak: 6:30pm–8:30pm",
    requirements:
      "Book through OnePA and log in with Singpass.",
    cost:
      "$6 non-peak | $8 peak",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesChangkatCC_BADMINTONCOURTS",
    websiteName: "OnePA",
    phone: "6781 1806",
    filter: "Sports",
    sport: "Badminton"
  },

  {
    id: 6,
    name: "Basketball @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "1 Tampines Walk, Singapore 528523",
    lat: 1.3528,
    lng: 103.9450,
    description:
      "Basketball courts at Team Sports Hall.",
    openingHours:
      "Daily: 7am–10pm",
    requirements:
      "ActiveSG account and Singpass login required.",
    cost:
      "SC/PR: $15 non-peak | $30 peak per hour",
    bookingLink:
      "https://activesg.gov.sg/facility-bookings/activities/CyIu0PE42fqR0SHD7XwMB/venues?postal-code=tampines",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Basketball"
  },

  {
    id: 7,
    name: "Swimming @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "1 Tampines Walk, Singapore 528523",
    lat: 1.3527,
    lng: 103.9447,
    description:
      "Special Features Swimming Complex with family and competition pools.",
    openingHours:
      "Daily: 6:30am–9:30pm",
    requirements:
      "ActiveSG account required.",
    cost:
      "Adult SC/PR: $1.50 weekdays | $2 weekends",
    bookingLink:
      "https://activesg.gov.sg/passes/activities/JSAvNPg7ZyVEGlf80aN9Q",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Swimming"
  },

  {
    id: 8,
    name: "SAFRA Tampines Swimming Pool",
    type: "Sports",
    category: "sports",
    address: "1A Tampines Street 92, Singapore 528882",
    lat: 1.3601,
    lng: 103.9578,
    description:
      "8-lane Olympic-size lap pool and wading pool.",
    openingHours:
      "Mon: 11am–9:30pm | Tue–Fri: 7am–9:30pm | Sat/Sun/PH: 8am–9:30pm",
    requirements:
      "SAFRA members enter free. Guests must be signed in by a SAFRA member.",
    cost:
      "$2.30 weekdays | $3.40 weekends/public holidays",
    bookingLink:
      "https://www.safra.sg/facilities-services",
    websiteName: "SAFRA",
    phone: "6785 8800",
    filter: "Sports",
    sport: "Swimming"
  },

  {
    id: 9,
    name: "Futsal @ Tampines East CC",
    type: "Sports",
    category: "sports",
    address: "10 Tampines Street 23, Singapore 529341",
    lat: 1.3566,
    lng: 103.9431,
    description:
      "Outdoor futsal court available for community bookings.",
    openingHours:
      "Non-Peak: 10am–4pm | Peak: 6pm onwards",
    requirements:
      "Book via OnePA with Singpass login.",
    cost:
      "$30–$45 non-peak | $60–$90 peak",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesEastCC_FUTSALCOURT",
    websiteName: "OnePA",
    phone: "6786 3227",
    filter: "Sports",
    sport: "Futsal"
  },

  {
    id: 10,
    name: "Soccer Field @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "1 Tampines Walk, Singapore 528523",
    lat: 1.3528,
    lng: 103.9450,
    description:
      "Full soccer field available for team bookings.",
    openingHours:
      "Non-Peak: 9am–5pm | Peak: 7pm–9pm",
    requirements:
      "Book via OnePA with Singpass login.",
    cost:
      "$170 non-peak | $330 peak",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=OurTampinesHub_SOCCERFIELD",
    websiteName: "OnePA",
    phone: null,
    filter: "Sports",
    sport: "Soccer"
  },

  // BBQ

  {
    id: 11,
    name: "BBQ Pit @ Our Tampines Hub",
    type: "Community",
    category: "bbq",
    address: "Level 5 Sky Garden, 1 Tampines Walk, Singapore 528523",
    lat: 1.3529,
    lng: 103.9449,
    description:
      "Popular rooftop BBQ pits at Our Tampines Hub Sky Garden.",
    openingHours:
      "Daily: 11:55am–11:55pm",
    requirements:
      "Book through OnePA. Singpass login required.",
    cost:
      "$30 per slot",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=OurTampinesHub_BBQPIT",
    websiteName: "OnePA",
    phone: null,
    filter: "BBQ",
    sport: null
  },

  {
    id: 12,
    name: "BBQ Pit @ Tampines North Sunplaza RN",
    type: "Community",
    category: "bbq",
    address: "418 Tampines Street 41, #01-72 Sun Plaza Gardens, Singapore 520418",
    lat: 1.3604,
    lng: 103.9477,
    description:
      "Resident network BBQ pit near Blk 407.",
    openingHours:
      "6pm–10pm",
    requirements:
      "Only residents of the division can make bookings.",
    cost:
      "$15 per slot",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesNorthSunplazaRN_BBQPIT",
    websiteName: "OnePA",
    phone: null,
    filter: "BBQ",
    sport: null
  },

  {
    id: 13,
    name: "BBQ Pit @ Tampines North Zone 7 RN",
    type: "Community",
    category: "bbq",
    address: "498M Tampines Street 45, #01-498, Singapore 529498",
    lat: 1.3650,
    lng: 103.9568,
    description:
      "Community BBQ pit for Tampines North residents.",
    openingHours:
      "Check OnePA for available slots",
    requirements:
      "Residents only booking.",
    cost:
      "Free",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=tampinesnorthzone7rn_BBQPIT",
    websiteName: "OnePA",
    phone: null,
    filter: "BBQ",
    sport: null
  },

  {
    id: 14,
    name: "BBQ Pit @ SAFRA Tampines",
    type: "Community",
    category: "bbq",
    address: "1A Tampines Street 92, Singapore 528882",
    lat: 1.3603,
    lng: 103.9580,
    description:
      "Sheltered BBQ pits near SAFRA Tampines sundeck.",
    openingHours:
      "AM Slot: 11am–3pm | PM Slot: 5pm–9pm",
    requirements:
      "Online booking only for SAFRA members. Guests require SAFRA member sign-in.",
    cost:
      "Member: $30.60 | Guest: $40.80 per slot",
    bookingLink:
      "https://m.safra.sg/login",
    websiteName: "SAFRA",
    phone: "6785 8800",
    filter: "BBQ",
    sport: null
  },

  //Community Facilities

  {
    id: 15,
    name: "Void Deck & Link Building Booking",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description:
      "Book void decks and link buildings for weddings, funerals, social and religious events.",
    openingHours:
      "Mon–Fri: 8am–5pm",
    requirements:
      "Funeral wake bookings must be made in person before setup. Some religious events require MP approval.",
    cost:
      "Social events: $54.50/day | Funeral wakes: Free | Utilities charged separately",
    bookingLink:
      "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null
  },

  {
    id: 16,
    name: "Open Space & Apron Area Booking",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description:
      "Book open spaces, apron areas and turf areas for social or religious functions.",
    openingHours:
      "Mon–Fri: 8am–5pm",
    requirements:
      "Subject to approval by PM in-charge. Generator required for electricity usage.",
    cost:
      "Rental: $21.80/day + $300 deposit",
    bookingLink:
      "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null
  },

  {
    id: 17,
    name: "Court Booking for Community Events",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description:
      "Book basketball, sepak takraw and badminton courts for community events.",
    openingHours:
      "Mon–Fri: 8am–5pm",
    requirements:
      "MP approval may be required depending on event type.",
    cost:
      "Small courts: $54.50/day | Big courts: $109/day | Deposit required",
    bookingLink:
      "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null
  },

  {
    id: 18,
    name: "Mini Fair Event Booking",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description:
      "Apply for mini-fair event permits at void decks or open spaces.",
    openingHours:
      "Mon–Fri: 8am–5pm",
    requirements:
      "Letter from Constituency Office and MP endorsement required. $1000 deposit required.",
    cost:
      "Void deck: $54.50/day | Open space: $21.80/day",
    bookingLink:
      "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null
  },

  {
    id: 19,
    name: "Bulky Item Removal Service",
    type: "Community",
    category: "bulky_removal",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description:
      "Free bulky item disposal service for Tampines residents.",
    openingHours:
      "Mon–Sat: 2pm–5pm (except PH)",
    requirements:
      "Limited to 3 items per month. Minimum 3 working days notice required.",
    cost:
      "Free",
    bookingLink:
      "https://www.tampines.org.sg/ResidentServices/BulkyItemRemovalServices",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null
  },

  {
    id: 20,
    name: "SAFRA Tampines Facilities & Function Rooms",
    type: "Community",
    category: "safra",
    address: "1A Tampines Street 92, Singapore 528882",
    lat: 1.3602,
    lng: 103.9579,
    description:
      "Function rooms, enrichment facilities, sports amenities, gym and event spaces.",
    openingHours:
      "Varies by facility",
    requirements:
      "SAFRA membership required for most bookings.",
    cost:
      "Prices vary depending on facility type.",
    bookingLink:
      "https://www.safra.sg/facilities-services",
    websiteName: "SAFRA",
    phone: "6785 8800",
    filter: "Community",
    sport: null
  },

  // COURSES

  {
    id: 21,
    name: "Chinese Calligraphy @ Tampines West CC",
    type: "Courses",
    category: "course",
    address: "5 Tampines Ave 3, #01-05, Singapore 529705",
    lat: 1.3452,
    lng: 103.9398,
    description:
      "Chinese calligraphy lessons covering brush techniques and writing styles.",
    openingHours:
      "Fridays, 7:15pm–9:15pm",
    requirements:
      "Age 12 and above. Material fee payable separately.",
    cost:
      "$158–$168",
    bookingLink:
      "https://www.onepa.gov.sg/courses/chinese-calligraphy-c027218364",
    websiteName: "OnePA",
    phone: "6788 1912",
    filter: "Courses",
    courseType: "Arts",
    sport: null
  },

  {
    id: 22,
    name: "PA Kiddies Sports Warrior @ Tampines Changkat CC",
    type: "Courses",
    category: "course",
    address: "13 Tampines Street 11, #01-01, Singapore 529453",
    lat: 1.3489,
    lng: 103.9412,
    description:
      "Kids multi-sport adventure programme with obstacle activities.",
    openingHours:
      "Tue 1:30pm–2:15pm",
    requirements:
      "For children aged 5–12 years old.",
    cost:
      "$21–$24.50",
    bookingLink:
      "https://www.onepa.gov.sg/courses/pa-kiddies-sports-warrior-for-all-kid30-c027218103",
    websiteName: "OnePA",
    phone: "6781 1806",
    filter: "Courses",
    courseType: "Kids",
    sport: null
  },

  {
    id: 23,
    name: "Ballet Classes @ Tampines North CC",
    type: "Courses",
    category: "course",
    address: "2 Tampines Street 41, Singapore 529204",
    lat: 1.3531,
    lng: 103.9449,
    description:
      "Intermediate and advanced ballet classes.",
    openingHours:
      "Sundays, various timings",
    requirements:
      "Assessment required for new students.",
    cost:
      "$210–$250",
    bookingLink:
      "https://www.onepa.gov.sg/courses/search?course=ballet&outlet=Tampines+North+CC",
    websiteName: "OnePA",
    filter: "Courses",
    courseType: "Dance",
    sport: null
  }
];

export default facilitiesData;