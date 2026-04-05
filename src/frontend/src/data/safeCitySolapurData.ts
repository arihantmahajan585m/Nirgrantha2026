/**
 * WIT Solapur + destination coords for Safe City Exploration.
 * Google Maps embed: https://www.google.com/maps?q=lat,lng&z=15&output=embed
 * Directions: https://www.google.com/maps/dir/?api=1&origin=...&destination=...
 * Images: Unsplash (license allows display in web apps).
 */

export const WIT_SOLAPUR_ORIGIN = {
  name: "Walchand Institute of Technology, Solapur",
  shortName: "WIT Solapur",
  address: "Ashok Chowk, Kanchanwadi, Solapur, Maharashtra 413006",
  lat: 17.671935,
  lng: 75.905899,
} as const;

export interface SafeCityPlace {
  name: string;
  description: string;
  safetyRating: number;
  bestTime: string;
  crowdType: "Students" | "Families" | "Mixed";
  collegeVerified: boolean;
  lat: number;
  lng: number;
  image: string;
}

export interface SafeCityCategory {
  emoji: string;
  title: string;
  accent: string;
  gradient: string;
  borderColor: string;
  places: SafeCityPlace[];
}

const img = {
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-6e820f2a4456?w=800&q=80",
  run: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
  food: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
  restaurant:
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  mallFood:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
  temple: "https://images.unsplash.com/photo-1548013146-7247974b1c20?w=800&q=80",
  meditate:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  iskcon:
    "https://images.unsplash.com/photo-1565008576549-57e0f7f5a59b?w=800&q=80",
  lake: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
  dmart: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
  shopping:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
  cinema: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
  retail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80",
  gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  arcade: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
  snooker:
    "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80",
  turf: "https://images.unsplash.com/photo-1529900748594-3b08badfebcd?w=800&q=80",
  park: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
  lakeWalk: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
  ground: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
  sunset: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
  code: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  library:
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
  seminar:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  startup:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
};

export const safeCityCategories: SafeCityCategory[] = [
  {
    emoji: "🏋️",
    title: "Fitness & Gyms",
    accent: "#ea580c",
    gradient: "linear-gradient(135deg, #ea580c 0%, #dc2626 100%)",
    borderColor: "#ea580c",
    places: [
      {
        name: "Modern Student Gyms",
        description:
          "Well-equipped local gyms near WIT and Solapur University offering affordable student membership plans with all major equipment.",
        safetyRating: 5,
        bestTime: "Morning 6–9 AM & Evening 5–8 PM",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6726,
        lng: 75.9041,
        image: img.gym,
      },
      {
        name: "Yoga & Wellness Centers",
        description:
          "Certified yoga studios offering group classes, meditation sessions, and wellness programs ideal for stress relief during exams.",
        safetyRating: 5,
        bestTime: "Morning 6–8 AM",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6741,
        lng: 75.9078,
        image: img.yoga,
      },
      {
        name: "Solapur Sports Complex",
        description:
          "Government-run sports complex with courts for badminton, basketball, volleyball and indoor sports facilities at subsidized rates.",
        safetyRating: 4,
        bestTime: "Mornings & Weekends",
        crowdType: "Mixed",
        collegeVerified: false,
        lat: 17.6652,
        lng: 75.9098,
        image: img.sports,
      },
      {
        name: "Siddheshwar Stadium Jogging Track",
        description:
          "Free public jogging track surrounding the stadium, popular with students and fitness enthusiasts. Well-lit and monitored.",
        safetyRating: 4,
        bestTime: "Morning 5:30–8 AM",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6744,
        lng: 75.9189,
        image: img.run,
      },
    ],
  },
  {
    emoji: "🍽️",
    title: "Pure Veg Food & Student Hangout Centers",
    accent: "#d97706",
    gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    borderColor: "#d97706",
    places: [
      {
        name: "MG Road Veg Food Street",
        description:
          "Popular veg food street with hygienic stalls offering chaats, dosa, pav bhaji, and affordable student meals under Rs. 80.",
        safetyRating: 4,
        bestTime: "Evenings 5–10 PM",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6712,
        lng: 75.9082,
        image: img.food,
      },
      {
        name: "Pure Veg Family Restaurants near WIT",
        description:
          "Well-known pure veg family dining restaurants within 2 km of Walchand Institute. Clean, well-lit spaces perfect for group study meals.",
        safetyRating: 5,
        bestTime: "Lunch 12–2 PM & Dinner 7–10 PM",
        crowdType: "Families",
        collegeVerified: true,
        lat: 17.6729,
        lng: 75.9046,
        image: img.restaurant,
      },
      {
        name: "Veg Cafe Study Spots",
        description:
          "Student-friendly veg cafes with coffee, snacks, Wi-Fi, power outlets, and a quiet ambience for individual study or small group discussions.",
        safetyRating: 5,
        bestTime: "10 AM – 9 PM",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6704,
        lng: 75.9069,
        image: img.cafe,
      },
      {
        name: "Veg Mall Food Courts",
        description:
          "Air-conditioned food courts with vegetarian counters, thali options, and student-friendly pricing inside Solapur mall zones.",
        safetyRating: 5,
        bestTime: "Afternoons & Weekends",
        crowdType: "Families",
        collegeVerified: false,
        lat: 17.6681,
        lng: 75.9148,
        image: img.mallFood,
      },
    ],
  },
  {
    emoji: "🕌",
    title: "Spiritual & Peaceful Places",
    accent: "#7c3aed",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
    borderColor: "#7c3aed",
    places: [
      {
        name: "Siddheshwar Temple & Surroundings",
        description:
          "One of Solapur's most iconic spiritual landmarks. The temple premises offer peace, architectural beauty, and a calm environment for reflection.",
        safetyRating: 5,
        bestTime: "Early Morning 6–9 AM",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6746,
        lng: 75.9192,
        image: img.temple,
      },
      {
        name: "Peaceful Meditation Centers",
        description:
          "Certified meditation and mindfulness centers in Solapur offering drop-in sessions and structured programs for students dealing with academic stress.",
        safetyRating: 5,
        bestTime: "Morning & Evening Sessions",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6732,
        lng: 75.9115,
        image: img.meditate,
      },
      {
        name: "ISKCON Temple (Nearby Region)",
        description:
          "Serene ISKCON temple in the nearby accessible region. Known for peaceful atmosphere, free prasadam, and organized spiritual programs.",
        safetyRating: 5,
        bestTime: "Evenings 5–8 PM & Sundays",
        crowdType: "Families",
        collegeVerified: false,
        lat: 17.652,
        lng: 75.918,
        image: img.iskcon,
      },
      {
        name: "Lake & Temple Walking Paths",
        description:
          "Beautiful walking paths around Siddheshwar Lake connecting temple ghats. Perfect for morning walks and peaceful group strolls.",
        safetyRating: 4,
        bestTime: "Morning 6–9 AM & Evenings",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6752,
        lng: 75.9184,
        image: img.lake,
      },
    ],
  },
  {
    emoji: "🛍️",
    title: "Malls & Safe Social Zones",
    accent: "#2563eb",
    gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    borderColor: "#2563eb",
    places: [
      {
        name: "D-Mart Commercial Area",
        description:
          "Large commercial area with supermarkets, eateries, and shops. Safe, well-monitored public zone ideal for group outings and grocery needs.",
        safetyRating: 5,
        bestTime: "10 AM – 9 PM Daily",
        crowdType: "Families",
        collegeVerified: true,
        lat: 17.6683,
        lng: 75.9151,
        image: img.dmart,
      },
      {
        name: "Central Solapur Shopping Mall",
        description:
          "Multi-storey shopping mall in central Solapur with branded stores, a food court, and entertainment zone. Well-staffed and CCTV covered.",
        safetyRating: 5,
        bestTime: "Afternoons & Weekends",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6707,
        lng: 75.9091,
        image: img.shopping,
      },
      {
        name: "PVR / Cinema Complexes",
        description:
          "INOX and local multiplexes offering safe indoor entertainment. Fully air-conditioned, well-monitored, and great for de-stressing on weekends.",
        safetyRating: 5,
        bestTime: "Evening Shows 6–10 PM",
        crowdType: "Mixed",
        collegeVerified: false,
        lat: 17.6714,
        lng: 75.9087,
        image: img.cinema,
      },
      {
        name: "Branded Retail Streets",
        description:
          "Popular branded retail stretches in Solapur's commercial hubs with well-known fashion, electronics and lifestyle stores. Busy and safe.",
        safetyRating: 4,
        bestTime: "11 AM – 8 PM Daily",
        crowdType: "Mixed",
        collegeVerified: false,
        lat: 17.6716,
        lng: 75.9076,
        image: img.retail,
      },
    ],
  },
  {
    emoji: "🎮",
    title: "Gaming & Recreation Zones",
    accent: "#0891b2",
    gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
    borderColor: "#0891b2",
    places: [
      {
        name: "Indoor Gaming Cafés",
        description:
          "Verified gaming cafes with high-end PCs, console setups, and fast internet. Popular among students for weekend gaming sessions.",
        safetyRating: 4,
        bestTime: "Afternoons & Weekends",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6692,
        lng: 75.9062,
        image: img.gaming,
      },
      {
        name: "Bowling & Arcade Centers",
        description:
          "Bowling alleys and arcade gaming zones in Solapur's malls. Great for group fun, birthday celebrations, and post-exam relaxation.",
        safetyRating: 5,
        bestTime: "Evenings & Weekends",
        crowdType: "Mixed",
        collegeVerified: false,
        lat: 17.6709,
        lng: 75.9093,
        image: img.arcade,
      },
      {
        name: "Verified Snooker Clubs",
        description:
          "College-vetted snooker clubs that are safe, well-managed, and frequented by students. Avoid unverified parlors in the city.",
        safetyRating: 3,
        bestTime: "Afternoons 2–7 PM",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6687,
        lng: 75.9052,
        image: img.snooker,
      },
      {
        name: "Sports Turf Grounds",
        description:
          "Artificial turf grounds available for hourly booking. Great for cricket, football, and friendly sports matches with friends.",
        safetyRating: 5,
        bestTime: "Evenings 4–9 PM & Weekends",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6642,
        lng: 75.9025,
        image: img.turf,
      },
    ],
  },
  {
    emoji: "🌿",
    title: "Nature & Relaxation Spots",
    accent: "#16a34a",
    gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    borderColor: "#16a34a",
    places: [
      {
        name: "Public Gardens & Parks",
        description:
          "Well-maintained public parks across Solapur with benches, walking paths, and green lawns. Ideal for reading, group study, or simply relaxing.",
        safetyRating: 4,
        bestTime: "Morning & Evening",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6762,
        lng: 75.9142,
        image: img.park,
      },
      {
        name: "Siddheshwar Lake Walking Area",
        description:
          "Scenic lake-side promenade with a 2 km walking path, gardens, and beautiful water views. One of Solapur's most popular relaxation destinations.",
        safetyRating: 4,
        bestTime: "Morning 6–9 AM & Sunset 5–7 PM",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6756,
        lng: 75.9186,
        image: img.lakeWalk,
      },
      {
        name: "Open Grounds for Group Meetups",
        description:
          "Spacious open sports grounds near colleges that serve as perfect venues for group meetups, outdoor activities, and informal gatherings.",
        safetyRating: 4,
        bestTime: "Evenings 4–7 PM",
        crowdType: "Students",
        collegeVerified: false,
        lat: 17.6731,
        lng: 75.9028,
        image: img.ground,
      },
      {
        name: "Sunrise / Sunset Viewpoints",
        description:
          "Elevated viewpoints around Solapur's outskirts offering breathtaking sunrise and sunset views. Best for photography enthusiasts and nature lovers.",
        safetyRating: 3,
        bestTime: "Sunrise 5:30–7 AM & Sunset 5:30–7 PM",
        crowdType: "Mixed",
        collegeVerified: false,
        lat: 17.6548,
        lng: 75.8945,
        image: img.sunset,
      },
    ],
  },
  {
    emoji: "💡",
    title: "Skill & Growth Places",
    accent: "#4338ca",
    gradient: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
    borderColor: "#4338ca",
    places: [
      {
        name: "Coding Institutes & Training Centers",
        description:
          "Verified coding and tech training centers in Solapur offering courses in web dev, DSA, Python, and placement prep at affordable student fees.",
        safetyRating: 5,
        bestTime: "Weekday Evenings & Weekends",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6706,
        lng: 75.9066,
        image: img.code,
      },
      {
        name: "Public Libraries (Solapur)",
        description:
          "Solapur's public libraries including the Central Library offer vast book collections, quiet study rooms, and free internet access for students.",
        safetyRating: 5,
        bestTime: "9 AM – 6 PM, Mon–Sat",
        crowdType: "Mixed",
        collegeVerified: true,
        lat: 17.6722,
        lng: 75.9112,
        image: img.library,
      },
      {
        name: "Seminar Halls & Convention Centers",
        description:
          "Convention halls and auditoriums that host regular technical seminars, career workshops, and industry events open to college students.",
        safetyRating: 5,
        bestTime: "Event-based (check schedule)",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6696,
        lng: 75.9081,
        image: img.seminar,
      },
      {
        name: "Startup & Incubation Hubs",
        description:
          "Startup incubation centers in Solapur offering co-working space, mentorship, and networking events for budding student entrepreneurs.",
        safetyRating: 5,
        bestTime: "10 AM – 6 PM, Weekdays",
        crowdType: "Students",
        collegeVerified: true,
        lat: 17.6677,
        lng: 75.9042,
        image: img.startup,
      },
    ],
  },
];

export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 15): string {
  const q = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed&hl=en`;
}

export function googleDirectionsFromWitUrl(destLat: number, destLng: number): string {
  const o = `${WIT_SOLAPUR_ORIGIN.lat},${WIT_SOLAPUR_ORIGIN.lng}`;
  const d = `${destLat},${destLng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=driving`;
}

/** Driving route WIT → destination (Google Maps embed, no API key). */
export function googleMapsEmbedDirectionsUrl(
  destLat: number,
  destLng: number,
): string {
  const o = `${WIT_SOLAPUR_ORIGIN.lat},${WIT_SOLAPUR_ORIGIN.lng}`;
  const d = `${destLat},${destLng}`;
  return `https://maps.google.com/maps?f=d&saddr=${o}&daddr=${d}&hl=en&output=embed`;
}
