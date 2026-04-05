export type MarketplaceCategory = "Hardware" | "Software" | "Books" | "Dev Boards";
export type MarketplaceCategoryFilter = "All" | MarketplaceCategory;
export type MarketplaceListingType = "Sell" | "Rent";
export type MarketplaceListingTypeFilter = "All" | MarketplaceListingType;
export type MarketplacePricingUnit = "item" | "day" | "week" | "semester";
export type MarketplacePaymentMethod =
  | "Razorpay"
  | "Campus Wallet"
  | "Cash on Meetup";

export interface MarketplaceListing {
  id: string;
  title: string;
  category: MarketplaceCategory;
  type: MarketplaceListingType;
  amount: number;
  pricingUnit: MarketplacePricingUnit;
  seller: string;
  sellerStatus: "online" | "away";
  rating: number;
  reviews: number;
  description: string;
  whatsappNumber: string;
  meetupLocation: string;
  meetupNotes: string;
  razorpayPaymentLink: string;
  accent: string;
  visual: "board" | "software" | "book" | "hardware";
  createdAt: string;
  isUserListing?: boolean;
}

export interface MarketplaceChatMessage {
  id: string;
  sender: "me" | "seller" | "system";
  text: string;
  createdAt: string;
  status: "sent" | "delivered" | "read";
}

export interface MarketplaceChatThread {
  id: string;
  listingId: string;
  listingTitle: string;
  seller: string;
  sellerStatus: "online" | "away";
  lastUpdatedAt: string;
  unreadCount: number;
  messages: MarketplaceChatMessage[];
}

export interface MarketplaceOrder {
  id: string;
  listingId: string;
  listingTitle: string;
  seller: string;
  buyer: string;
  listingType: MarketplaceListingType;
  paymentMethod: MarketplacePaymentMethod;
  amount: number;
  pricingLabel: string;
  status: "Paid" | "Reserved" | "Meetup Pending";
  transactionRef: string;
  createdAt: string;
}

export interface MarketplaceStore {
  customListings: MarketplaceListing[];
  orders: MarketplaceOrder[];
  threads: MarketplaceChatThread[];
}

const STORAGE_KEY = "nirgrantha.student.marketplace";

export const marketplaceCategories: MarketplaceCategoryFilter[] = [
  "All",
  "Hardware",
  "Software",
  "Books",
  "Dev Boards",
];

export const marketplaceTypeFilters: MarketplaceListingTypeFilter[] = [
  "All",
  "Sell",
  "Rent",
];

export const marketplacePaymentMethods: {
  id: MarketplacePaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "Razorpay",
    label: "Razorpay",
    description: "UPI, cards, and netbanking checkout",
  },
];

export const seededMarketplaceListings: MarketplaceListing[] = [
  {
    id: "listing-arduino-mega",
    title: "Arduino Mega 2560",
    category: "Dev Boards",
    type: "Sell",
    amount: 1200,
    pricingUnit: "item",
    seller: "Arjun M.",
    sellerStatus: "online",
    rating: 4.8,
    reviews: 12,
    description: "Barely used board with USB cable and tested pins.",
    whatsappNumber: "919876543210",
    meetupLocation: "Innovation Lab Block",
    meetupNotes: "Negotiation possible after 4 PM.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-blue-500 to-indigo-600",
    visual: "board",
    createdAt: "2026-04-01T09:00:00.000Z",
  },
  {
    id: "listing-rpi4",
    title: "Raspberry Pi 4 (4GB)",
    category: "Dev Boards",
    type: "Rent",
    amount: 150,
    pricingUnit: "day",
    seller: "Priya N.",
    sellerStatus: "online",
    rating: 4.9,
    reviews: 8,
    description: "Power adapter, case, and fresh Raspberry Pi OS image included.",
    whatsappNumber: "919812345678",
    meetupLocation: "Library Front Desk",
    meetupNotes: "Meetup preferred before evening lab slot.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-rose-500 to-pink-600",
    visual: "board",
    createdAt: "2026-04-02T10:15:00.000Z",
  },
  {
    id: "listing-gate-books",
    title: "GATE CSE 2026 Book Set",
    category: "Books",
    type: "Sell",
    amount: 800,
    pricingUnit: "item",
    seller: "Rahul S.",
    sellerStatus: "away",
    rating: 4.6,
    reviews: 23,
    description: "Six-book set with short notes, formulas, and solved papers.",
    whatsappNumber: "919811112222",
    meetupLocation: "Main Reading Hall",
    meetupNotes: "Can reduce price if bought together.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-amber-500 to-orange-500",
    visual: "book",
    createdAt: "2026-04-01T08:20:00.000Z",
  },
  {
    id: "listing-oscilloscope",
    title: "Oscilloscope 100MHz",
    category: "Hardware",
    type: "Rent",
    amount: 200,
    pricingUnit: "day",
    seller: "Vikram R.",
    sellerStatus: "online",
    rating: 4.7,
    reviews: 6,
    description: "Calibrated lab unit, probes included, ideal for mini projects.",
    whatsappNumber: "919833344455",
    meetupLocation: "Electronics Lab Entrance",
    meetupNotes: "Inspection allowed before final payment.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-cyan-500 to-sky-600",
    visual: "hardware",
    createdAt: "2026-03-31T16:00:00.000Z",
  },
  {
    id: "listing-jetbrains",
    title: "JetBrains Student Bundle Setup Help",
    category: "Software",
    type: "Sell",
    amount: 500,
    pricingUnit: "item",
    seller: "Sneha P.",
    sellerStatus: "away",
    rating: 4.5,
    reviews: 15,
    description: "Guided setup for IntelliJ, PyCharm, and Rider on your laptop.",
    whatsappNumber: "919822233344",
    meetupLocation: "CSE Department Lobby",
    meetupNotes: "Share your laptop specs before meeting.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-violet-500 to-purple-600",
    visual: "software",
    createdAt: "2026-04-03T07:45:00.000Z",
  },
  {
    id: "listing-esp32",
    title: "ESP32 Development Kit",
    category: "Dev Boards",
    type: "Sell",
    amount: 450,
    pricingUnit: "item",
    seller: "Karthik I.",
    sellerStatus: "online",
    rating: 4.9,
    reviews: 9,
    description: "WiFi and Bluetooth enabled board with jumper wires and breadboard.",
    whatsappNumber: "919844455566",
    meetupLocation: "Startup Cell Desk",
    meetupNotes: "Quick negotiation possible on WhatsApp first.",
    razorpayPaymentLink: "https://razorpay.com/payment-links/",
    accent: "from-emerald-500 to-teal-600",
    visual: "board",
    createdAt: "2026-04-02T12:10:00.000Z",
  },
];

const DEFAULT_STORE: MarketplaceStore = {
  customListings: [],
  orders: [],
  threads: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeStore(
  raw: Partial<MarketplaceStore> | null | undefined,
): MarketplaceStore {
  const customListings = (raw?.customListings ?? []).map((listing) => ({
    ...listing,
    whatsappNumber: listing.whatsappNumber ?? "",
    meetupLocation: listing.meetupLocation ?? "Campus meetup point",
    meetupNotes: listing.meetupNotes ?? "",
    razorpayPaymentLink:
      listing.razorpayPaymentLink ?? "https://razorpay.com/payment-links/",
  }));

  return {
    customListings,
    orders: raw?.orders ?? [],
    threads: raw?.threads ?? [],
  };
}

export function getStudentMarketplaceStore() {
  if (!isBrowser()) {
    return DEFAULT_STORE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STORE;
    }

    return normalizeStore(JSON.parse(raw) as Partial<MarketplaceStore>);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStudentMarketplaceStore(store: MarketplaceStore) {
  const normalized = normalizeStore(store);

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

export function formatMarketplacePrice(listing: MarketplaceListing) {
  if (listing.type === "Rent" && listing.pricingUnit !== "item") {
    return `Rs. ${listing.amount}/${listing.pricingUnit}`;
  }

  return `Rs. ${listing.amount}`;
}

export function formatOrderStatusLabel(order: MarketplaceOrder) {
  if (order.status === "Reserved") {
    return `${order.status} via ${order.paymentMethod}`;
  }

  if (order.status === "Meetup Pending") {
    return "Meetup payment pending";
  }

  return `${order.status} via ${order.paymentMethod}`;
}
