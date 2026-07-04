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
    sport: null,
    imageUrl: "https://wherecrowded.sg/at/storage/images_p/68323-tn.jpg",
    // NEW: Machine-readable logic data (24-hour format)
    schedule: {
      1: { open: "08:00", close: "16:30" }, // Mon
      2: { open: "08:00", close: "16:30" }, // Tue
      3: { open: "08:00", close: "16:30" }, // Wed
      4: { open: "08:00", close: "16:30" }, // Thu
      5: { open: "08:00", close: "16:30" }, // Fri
      6: { open: "08:00", close: "12:30" }, // Sat
      0: null // Sun (Closed)
    }
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
    sport: null,
    imageUrl: "https://polyclinic.singhealth.com.sg/adobe/dynamicmedia/deliver/dm-aid--9f887b86-b991-4169-8e43-1e514ed35772/microsoftteams-image-%281%29.png?preferwebp=true"
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
      "Daily: 7am–10pm",
    requirements:
      "ActiveSG account and Singpass login required. Maximum 2 slots per day.",
    cost:
      "SC/PR: $3.50 non-peak | $7.40 peak per hour per court. Standard Rates: $4.60 non-peak | $9.70 peak per hour per court.",
    bookingLink:
      "https://activesg.gov.sg/facility-bookings/activities/YLONatwvqJfikKOmB5N9U/venues?postal-code=tampines",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Badminton",
    imageUrl: "https://www.activesgcircle.gov.sg/hs-fs/hubfs/Circle%202-0_2021-%20Circle%20Website%20Refresh/Image/20230119_OTH%20Team%20Sport%20Hall_9058-new.webp?width=1104&height=398&name=20230119_OTH%20Team%20Sport%20Hall_9058-new.webp",
    // NEW: Machine-readable logic data
    schedule: {
      1: { open: "07:00", close: "22:00" },
      2: { open: "07:00", close: "22:00" },
      3: { open: "07:00", close: "22:00" },
      4: { open: "07:00", close: "22:00" },
      5: { open: "07:00", close: "22:00" },
      6: { open: "07:00", close: "22:00" },
      0: { open: "07:00", close: "22:00" }
    }
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
      "Non-Peak: 10am–5pm | Peak: 6pm–9pm",
    requirements:
      "Book through OnePA and log in with Singpass.",
    cost:
      "$5–$6 non-peak | $6–$7 peak per slot",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesEastCC_BADMINTONCOURTS",
    websiteName: "OnePA",
    phone: "6786 3227",
    filter: "Sports",
    sport: "Badminton",
    imageUrl: "https://www.streetdirectory.com/stock_images/travel/simg_show/15972783520812/93422_1024/tampines_east_community_club_cc/"
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
      "Non-Peak: 10:30am–5:30pm | Peak: 6:30pm–9:30pm",
    requirements:
      "Book through OnePA and log in with Singpass.",
    cost:
      "$6 non-peak | $8 peak",
    bookingLink:
      "https://www.onepa.gov.sg/facilities/availability?facilityId=TampinesChangkatCC_BADMINTONCOURTS",
    websiteName: "OnePA",
    phone: "6781 1806",
    filter: "Sports",
    sport: "Badminton",
    imageUrl: "https://media.timeout.com/images/106244538/1920/1080/image.webp"
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
    sport: "Basketball",
    imageUrl: "https://www.activesgcircle.gov.sg/hubfs/Circle%202-0_2021-%20Circle%20Website%20Refresh/Image/20221227_Tampines_5443.webp"
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
    sport: "Swimming",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
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
    sport: "Swimming",
    imageUrl: "https://prd-afd-sitefinity-h0ardtc3d4awdubh.a01.azurefd.net/media-library/images/default-source/default-album/swimming-pool.jpg?sfvrsn=db4d062a_0 "
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
    sport: "Futsal",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSAfrm63aCVeNrIDhHGCd5k2v56OJ3Ix3OlB_rL4xsco6U2CzpELO72Tav&s=10"
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
    sport: "Soccer",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Our_Tampines_Hub_Town_Square.jpg/960px-Our_Tampines_Hub_Town_Square.jpg.webp"
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
    sport: null,
    imageUrl: "https://workingwithgrace.wordpress.com/wp-content/uploads/2017/11/our-tampines-hub-barbecue-pits.jpg?w=584&h=389"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://prd-afd-sitefinity-h0ardtc3d4awdubh.a01.azurefd.net/media-library/images/default-source/facilities/barbeque-pits/bbq-pit-overview.jpg?sfvrsn=50634e54_2"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
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
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: 24,
    name: "Booking of Parks (Tampines Town Council)",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description: "Book parks within Tampines for social events only.",
    openingHours: "Mon–Fri: 8am–5pm",
    requirements: "Application via Tampines Town Council counter. Subject to approval.",
    cost: "Paid (rates vary)",
    bookingLink: "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: 25,
    name: "Open Spaces/Void Decks for Grassroots Activities",
    type: "Community",
    category: "common_area",
    address: "136 Tampines Street 11, Singapore 521136",
    lat: 1.3489,
    lng: 103.9434,
    description: "Book void decks and open spaces for grassroots/community activities. Free for approved grassroots organisations.",
    openingHours: "Mon–Fri: 8am–5pm",
    requirements: "Must be a grassroots organisation. Visit Town Council counter to book.",
    cost: "Free",
    bookingLink: "https://www.life.gov.sg/services-tools/book-facilities",
    websiteName: "Tampines Town Council",
    phone: "6781 2222",
    filter: "Community",
    sport: null,
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: 26,
    name: "ActiveSG Gym @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "Level 7, 1 Tampines Walk, Singapore 528523",
    lat: 1.3529,
    lng: 103.9449,
    description: "ActiveGYM™ on Level 7 of Our Tampines Hub with modern gym equipment.",
    openingHours: "Daily: 7am–10pm",
    requirements: "ActiveSG account and Singpass login required.",
    cost: "SC/PR Adult: $2.50 | SC/PR Student/Senior: $1.50 | Standard Rate: $3.30",
    bookingLink: "https://activesg.gov.sg/passes/activities/8JfPH6hlXBvlYJAqVzmPg",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Gym",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: 27,
    name: "SAFRA EnergyOne Gym @ Tampines",
    type: "Sports",
    category: "sports",
    address: "1A Tampines Street 92, Singapore 528882",
    lat: 1.3601,
    lng: 103.9578,
    description: "Full-equipped gym at SAFRA Tampines. Open to SAFRA members and walk-in guests (SC/PR, 16 years and above).",
    openingHours: "Daily: 6:30am–10:30pm",
    requirements: "Must be 16 years old and above. SAFRA membership or walk-in guest fee. Bring NRIC/SAFRA card. Download SAFRA Mobile App for e-card.",
    cost: "Weekday Off-Peak (until 5pm): Members $8.75 | SC/PR $13.10. Weekday Peak (5pm–10:30pm): Members $14.20 | SC/PR $21.80. Weekends/PH (all day): Members $11.50 | SC/PR $17.50. Monthly memberships from ~$45–$60/month.",
    bookingLink: "https://www.safra.sg/energyone-gym",
    websiteName: "SAFRA",
    phone: "6785 8800",
    filter: "Sports",
    sport: "Gym",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
  },

  {
    id: 28,
    name: "Table Tennis @ Our Tampines Hub",
    type: "Sports",
    category: "sports",
    address: "1 Tampines Walk, Singapore 528523",
    lat: 1.3529,
    lng: 103.9449,
    description: "Table tennis tables available for booking at Our Tampines Hub via ActiveSG.",
    openingHours: "Daily: 7am–10pm",
    requirements: "ActiveSG account and Singpass login required.",
    cost: "SC/PR: $1.50 non-peak | $3.20 peak per hour per table. Standard: $2.00 non-peak | $4.20 peak. Non-peak: 7am–6pm | Peak: 6pm–10pm.",
    bookingLink: "https://activesg.gov.sg/facility-bookings/activities/lpa7rfS4ShmUUt7XsFJlD/venues?postal-code=tampines",
    websiteName: "ActiveSG",
    phone: null,
    filter: "Sports",
    sport: "Table Tennis",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
  },
];

export default facilitiesData;