import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  CreditCard,
  ExternalLink,
  Filter,
  Laptop,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Wallet,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getStudentTalentProfileStore } from "@/utils/studentTalentProfile";
import {
  formatMarketplacePrice,
  formatOrderStatusLabel,
  getStudentMarketplaceStore,
  marketplaceCategories,
  marketplacePaymentMethods,
  marketplaceTypeFilters,
  saveStudentMarketplaceStore,
  seededMarketplaceListings,
  type MarketplaceCategory,
  type MarketplaceCategoryFilter,
  type MarketplaceChatMessage,
  type MarketplaceChatThread,
  type MarketplaceListing,
  type MarketplaceListingType,
  type MarketplaceListingTypeFilter,
  type MarketplacePricingUnit,
  type MarketplaceStore,
} from "@/utils/studentMarketplace";

type ListingDraft = {
  title: string;
  category: MarketplaceCategory;
  type: MarketplaceListingType;
  amount: string;
  pricingUnit: MarketplacePricingUnit;
  description: string;
  whatsappNumber: string;
  meetupLocation: string;
  meetupNotes: string;
  razorpayPaymentLink: string;
};

const CATEGORY_META: Record<
  MarketplaceCategory,
  { accent: string; visual: MarketplaceListing["visual"] }
> = {
  Hardware: { accent: "from-cyan-500 to-sky-600", visual: "hardware" },
  Software: { accent: "from-violet-500 to-purple-600", visual: "software" },
  Books: { accent: "from-amber-500 to-orange-500", visual: "book" },
  "Dev Boards": { accent: "from-blue-500 to-indigo-600", visual: "board" },
};

const EMPTY_DRAFT: ListingDraft = {
  title: "",
  category: "Hardware",
  type: "Sell",
  amount: "",
  pricingUnit: "item",
  description: "",
  whatsappNumber: "",
  meetupLocation: "",
  meetupNotes: "",
  razorpayPaymentLink: "",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

function ListingVisual({ listing }: { listing: MarketplaceListing }) {
  const common = "h-14 w-14 text-white";

  switch (listing.visual) {
    case "board":
      return <Cpu className={common} />;
    case "software":
      return <Laptop className={common} />;
    case "book":
      return <BookOpen className={common} />;
    case "hardware":
      return <Wrench className={common} />;
    default:
      return <Package className={common} />;
  }
}

function formatChatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function buildWhatsappLink(listing: MarketplaceListing) {
  const phone = normalizeWhatsappNumber(listing.whatsappNumber);
  const text = encodeURIComponent(
    `Hi ${listing.seller}, I want to negotiate for ${listing.title}. Can we discuss the price and meetup?`,
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : "";
}

function buildSellerReply(listing: MarketplaceListing, message: string) {
  const text = message.toLowerCase();

  if (text.includes("available")) {
    return `${listing.title} is available right now.`;
  }

  if (text.includes("price") || text.includes("discount")) {
    if (listing.type === "Rent") {
      return `The current rent is ${formatMarketplacePrice(listing)}. I can keep it ready if you confirm today.`;
    }

    return `The current price is ${formatMarketplacePrice(listing)}. If you confirm quickly, I can discuss a small campus pickup discount.`;
  }

  if (text.includes("pickup") || text.includes("meet") || text.includes("location")) {
    return `Meet me at ${listing.meetupLocation}. ${listing.meetupNotes || "We can finalize the timing on WhatsApp."}`;
  }

  if (text.includes("condition") || text.includes("working")) {
    return "It is in good working condition, and you can inspect it before confirming.";
  }

  return `Sure. For faster negotiation, message me on WhatsApp and we can meet at ${listing.meetupLocation}.`;
}

export default function SustainableMarketplace() {
  const currentStudentName =
    getStudentTalentProfileStore().studentName || "Arihant Mahajan";
  const [store, setStore] = useState<MarketplaceStore>(() =>
    getStudentMarketplaceStore(),
  );
  const [activeCategory, setActiveCategory] =
    useState<MarketplaceCategoryFilter>("All");
  const [activeType, setActiveType] =
    useState<MarketplaceListingTypeFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [listingDraft, setListingDraft] = useState<ListingDraft>(EMPTY_DRAFT);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const existingStore = getStudentMarketplaceStore();
    return existingStore.threads[0]?.id ?? null;
  });
  const [draftMessage, setDraftMessage] = useState("");
  const [typingThreadId, setTypingThreadId] = useState<string | null>(null);
  const replyTimers = useRef<number[]>([]);

  useEffect(() => {
    saveStudentMarketplaceStore(store);
  }, [store]);

  useEffect(() => {
    return () => {
      replyTimers.current.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  useEffect(() => {
    if (!activeThreadId && store.threads[0]) {
      setActiveThreadId(store.threads[0].id);
      return;
    }

    if (
      activeThreadId &&
      !store.threads.some((thread) => thread.id === activeThreadId)
    ) {
      setActiveThreadId(store.threads[0]?.id ?? null);
    }
  }, [activeThreadId, store.threads]);

  const catalog = [...store.customListings, ...seededMarketplaceListings].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  const filteredListings = catalog.filter((listing) => {
    const matchesCategory =
      activeCategory === "All" || listing.category === activeCategory;
    const matchesType = activeType === "All" || listing.type === activeType;
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      [listing.title, listing.description, listing.seller, listing.category]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });
  const threads = [...store.threads].sort(
    (left, right) =>
      new Date(right.lastUpdatedAt).getTime() -
      new Date(left.lastUpdatedAt).getTime(),
  );
  const activeThread =
    threads.find((thread) => thread.id === activeThreadId) ?? null;
  const activeThreadListing = activeThread
    ? catalog.find((listing) => listing.id === activeThread.listingId) ?? null
    : null;
  const recentOrders = [...store.orders].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() -
      new Date(left.createdAt).getTime(),
  );
  const sellCount = catalog.filter((listing) => listing.type === "Sell").length;
  const rentCount = catalog.filter((listing) => listing.type === "Rent").length;

  function updateStore(
    updater: (previous: MarketplaceStore) => MarketplaceStore,
  ) {
    setStore((previous) => updater(previous));
  }

  function resetListingDraft(nextType: MarketplaceListingType = "Sell") {
    setListingDraft({
      ...EMPTY_DRAFT,
      type: nextType,
      pricingUnit: nextType === "Rent" ? "day" : "item",
    });
  }

  function openListingDialog(nextType: MarketplaceListingType) {
    resetListingDraft(nextType);
    setListingDialogOpen(true);
  }

  function handleCreateListing() {
    const amount = Number(listingDraft.amount);
    if (!listingDraft.title.trim() || !listingDraft.description.trim()) {
      toast.error("Add the item title and description.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount for the listing.");
      return;
    }

    const whatsappNumber = normalizeWhatsappNumber(listingDraft.whatsappNumber);
    if (whatsappNumber.length < 10) {
      toast.error("Add a valid WhatsApp number for negotiation.");
      return;
    }

    if (!listingDraft.meetupLocation.trim()) {
      toast.error("Add a meetup location for physical negotiation.");
      return;
    }

    const razorpayPaymentLink = normalizeExternalUrl(
      listingDraft.razorpayPaymentLink,
    );
    if (
      !razorpayPaymentLink ||
      !/razorpay/i.test(razorpayPaymentLink)
    ) {
      toast.error("Add a valid Razorpay payment link for direct checkout.");
      return;
    }

    const meta = CATEGORY_META[listingDraft.category];
    const now = new Date().toISOString();
    const nextListing: MarketplaceListing = {
      id: `listing-${Date.now().toString(36)}`,
      title: listingDraft.title.trim(),
      category: listingDraft.category,
      type: listingDraft.type,
      amount,
      pricingUnit:
        listingDraft.type === "Rent" ? listingDraft.pricingUnit : "item",
      seller: currentStudentName,
      sellerStatus: "online",
      rating: 5,
      reviews: 0,
      description: listingDraft.description.trim(),
      whatsappNumber,
      meetupLocation: listingDraft.meetupLocation.trim(),
      meetupNotes: listingDraft.meetupNotes.trim(),
      razorpayPaymentLink,
      accent: meta.accent,
      visual: meta.visual,
      createdAt: now,
      isUserListing: true,
    };

    updateStore((previous) => ({
      ...previous,
      customListings: [nextListing, ...previous.customListings],
    }));

    setActiveCategory("All");
    setActiveType(nextListing.type);
    setSearchQuery("");
    setListingDialogOpen(false);
    resetListingDraft(nextListing.type);
    toast.success(`${nextListing.title} is live in the marketplace.`);
  }

  function ensureThread(listing: MarketplaceListing) {
    let resolvedThreadId = "";

    updateStore((previous) => {
      const existingThread = previous.threads.find(
        (thread) => thread.listingId === listing.id,
      );

      if (existingThread) {
        resolvedThreadId = existingThread.id;
        return previous;
      }

      const now = new Date().toISOString();
      const introMessage: MarketplaceChatMessage = {
        id: `msg-${Date.now().toString(36)}`,
        sender: "seller",
        text: `Hi ${currentStudentName.split(" ")[0]}, I am ${listing.seller}. ${listing.title} is available at ${formatMarketplacePrice(listing)}. WhatsApp me on ${listing.whatsappNumber} or meet at ${listing.meetupLocation}.`,
        createdAt: now,
        status: "read",
      };

      const nextThread: MarketplaceChatThread = {
        id: `thread-${listing.id}`,
        listingId: listing.id,
        listingTitle: listing.title,
        seller: listing.seller,
        sellerStatus: listing.sellerStatus,
        lastUpdatedAt: now,
        unreadCount: 0,
        messages: [introMessage],
      };

      resolvedThreadId = nextThread.id;
      return {
        ...previous,
        threads: [nextThread, ...previous.threads],
      };
    });

    setActiveThreadId(resolvedThreadId);
    return resolvedThreadId;
  }

  function scrollToChat() {
    if (typeof document === "undefined") {
      return;
    }

    document
      .getElementById("marketplace-chat-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleOpenChat(listing: MarketplaceListing) {
    ensureThread(listing);
    scrollToChat();
  }

  function handleDirectRazorpayCheckout(listing: MarketplaceListing) {
    const now = new Date().toISOString();
    const transactionRef = `pay_${Date.now().toString(36)}`;
    const existingThread = store.threads.find(
      (thread) => thread.listingId === listing.id,
    );
    const threadId = existingThread?.id ?? `thread-${listing.id}`;
    const introMessage: MarketplaceChatMessage = {
      id: `msg-${Date.now().toString(36)}-intro`,
      sender: "seller",
      text: `Hi ${currentStudentName.split(" ")[0]}, I am ${listing.seller}. ${listing.title} is available at ${formatMarketplacePrice(listing)}. WhatsApp me on ${listing.whatsappNumber} or meet at ${listing.meetupLocation}.`,
      createdAt: now,
      status: "read",
    };
    const systemMessage: MarketplaceChatMessage = {
      id: `msg-${Date.now().toString(36)}-system`,
      sender: "system",
      text: `Redirecting to Razorpay for ${listing.title}. Reference: ${transactionRef}. Final price negotiation can continue on WhatsApp or at ${listing.meetupLocation}.`,
      createdAt: now,
      status: "read",
    };

    const nextOrder = {
      id: `order-${Date.now().toString(36)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      seller: listing.seller,
      buyer: currentStudentName,
      listingType: listing.type,
      paymentMethod: "Razorpay",
      amount: listing.amount,
      pricingLabel: formatMarketplacePrice(listing),
      status: listing.type === "Rent" ? "Reserved" : "Paid",
      transactionRef,
      createdAt: now,
    } satisfies MarketplaceStore["orders"][number];

    const nextThreads = existingThread
      ? store.threads.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                sellerStatus: listing.sellerStatus,
                lastUpdatedAt: now,
                messages: [...thread.messages, systemMessage],
              }
            : thread,
        )
      : [
          {
            id: threadId,
            listingId: listing.id,
            listingTitle: listing.title,
            seller: listing.seller,
            sellerStatus: listing.sellerStatus,
            lastUpdatedAt: now,
            unreadCount: 0,
            messages: [introMessage, systemMessage],
          },
          ...store.threads,
        ];

    const nextStore = {
      ...store,
      orders: [nextOrder, ...store.orders],
      threads: nextThreads,
    };
    saveStudentMarketplaceStore(nextStore);
    setStore(nextStore);
    setActiveThreadId(threadId);

    toast.success(`Redirecting to Razorpay for ${listing.title}.`);
    window.location.assign(listing.razorpayPaymentLink);
  }

  function handleSendMessage() {
    if (!activeThread || !activeThreadListing || !draftMessage.trim()) {
      return;
    }

    const threadId = activeThread.id;
    const listing = activeThreadListing;
    const messageText = draftMessage.trim();
    const now = new Date().toISOString();

    updateStore((previous) => ({
      ...previous,
      threads: previous.threads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastUpdatedAt: now,
              unreadCount: 0,
              messages: [
                ...thread.messages,
                {
                  id: `msg-${Date.now().toString(36)}`,
                  sender: "me",
                  text: messageText,
                  createdAt: now,
                  status: "read",
                },
              ],
            }
          : thread,
      ),
    }));

    setDraftMessage("");
    setTypingThreadId(threadId);

    const timerId = window.setTimeout(() => {
      const replyTime = new Date().toISOString();
      updateStore((previous) => ({
        ...previous,
        threads: previous.threads.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                lastUpdatedAt: replyTime,
                messages: [
                  ...thread.messages,
                  {
                    id: `msg-${Date.now().toString(36)}`,
                    sender: "seller",
                    text: buildSellerReply(listing, messageText),
                    createdAt: replyTime,
                    status: "read",
                  },
                ],
              }
            : thread,
        ),
      }));
      setTypingThreadId((current) => (current === threadId ? null : current));
    }, 900);

    replyTimers.current.push(timerId);
  }

  function handleSelectThread(threadId: string) {
    setActiveThreadId(threadId);
    updateStore((previous) => ({
      ...previous,
      threads: previous.threads.map((thread) =>
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread,
      ),
    }));
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #7f1d1d 0%, #991b1b 28%, #dc2626 60%, #fb7185 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_35%)]" />
        <div className="relative flex flex-col gap-6 px-8 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Live campus marketplace
            </div>
            <h1 className="mt-4 font-display text-3xl font-black text-white">
              Sustainable Marketplace
            </h1>
            <p className="mt-2 text-sm text-white/80">
              List items for sale or rent, negotiate on WhatsApp or campus
              meetup, and then pay directly on Razorpay.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Listings", value: catalog.length },
              { label: "Sell", value: sellCount },
              { label: "Rent", value: rentCount },
              { label: "Payments", value: recentOrders.length },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-white backdrop-blur-sm"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-black">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                List new things by type
              </h2>
              <p className="text-sm text-slate-500">
                Add a fresh sell or rent listing and it appears instantly in the
                student marketplace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => openListingDialog("Sell")}
                className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                List Item for Sale
              </Button>
              <Button
                onClick={() => openListingDialog("Rent")}
                variant="outline"
                className="rounded-xl border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Clock className="mr-1.5 h-4 w-4" />
                List Item for Rent
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Payment methods
              </h3>
              <p className="text-sm text-slate-500">
                Buyers go straight to the seller's Razorpay link after
                negotiation.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {marketplacePaymentMethods.map((method) => (
              <div
                key={method.id}
                className="rounded-2xl border border-indigo-100 bg-white/90 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{method.label}</p>
                  {method.id === "Razorpay" && (
                    <Badge className="border-0 bg-indigo-100 text-indigo-700">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              {marketplaceCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    activeCategory === category
                      ? "bg-rose-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title, seller, or category"
                className="rounded-xl border-slate-200 pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {marketplaceTypeFilters.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  activeType === type
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
            <span className="ml-1 text-xs text-slate-500">
              {filteredListings.length} matching listings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden rounded-3xl border-0 shadow-lg shadow-rose-100"
            >
              <div className={`bg-gradient-to-br ${listing.accent} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                    <ListingVisual listing={listing} />
                  </div>
                  <div className="space-y-2 text-right">
                    <Badge
                      className={`border-0 ${
                        listing.type === "Sell"
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {listing.type}
                    </Badge>
                    <div>
                      <Badge className="border-0 bg-white/20 text-white">
                        {listing.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white">
                    {listing.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/80 line-clamp-2">
                    {listing.description}
                  </p>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Price
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {formatMarketplacePrice(listing)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <StarRating rating={listing.rating} />
                      <span className="text-xs text-slate-500">
                        ({listing.reviews})
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Listed {formatShortDateTime(listing.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {listing.seller}
                    </p>
                    <p className="text-xs text-slate-500">
                      {listing.sellerStatus === "online"
                        ? "Online now"
                        : "Replies later"}
                    </p>
                  </div>
                  {listing.isUserListing && (
                    <Badge className="border-0 bg-amber-100 text-amber-700">
                      Your listing
                    </Badge>
                  )}
                </div>

                <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        WhatsApp
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {listing.whatsappNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-rose-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Meetup
                      </p>
                      <p className="text-sm font-medium text-slate-900">
                        {listing.meetupLocation}
                      </p>
                      {listing.meetupNotes && (
                        <p className="mt-1 text-xs text-slate-500">
                          {listing.meetupNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
                  Negotiate first on WhatsApp or at meetup, then use the direct
                  Razorpay payment button below.
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleDirectRazorpayCheckout(listing)}
                    className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    {listing.type === "Sell" ? "Pay on Razorpay" : "Reserve on Razorpay"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const whatsappUrl = buildWhatsappLink(listing);
                      if (!whatsappUrl) {
                        toast.error("Seller has not shared a valid WhatsApp number yet.");
                        return;
                      }
                      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Phone className="mr-1.5 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleOpenChat(listing)}
                  className="w-full rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" />
                  Open In-App Chat
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent payments and orders
              </h2>
              <p className="text-sm text-slate-500">
                Every direct Razorpay payment redirect is saved here.
              </p>
            </div>
            <Badge className="border-0 bg-emerald-100 text-emerald-700">
              {recentOrders.length} orders
            </Badge>
          </div>

          {recentOrders.length === 0 ? (
            <div className="mt-5 rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
              <CreditCard className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="mt-3 font-semibold text-slate-900">
                No payments yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Use Buy Now or Reserve Now on a listing to create the first
                marketplace order.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {recentOrders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {order.listingTitle}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Seller: {order.seller} | Buyer: {order.buyer}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-0 bg-white text-emerald-700">
                        {formatOrderStatusLabel(order)}
                      </Badge>
                      <Badge className="border-0 bg-white text-slate-700">
                        {order.pricingLabel}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>Reference: {order.transactionRef}</span>
                    <span>{formatShortDateTime(order.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-600 p-3 text-white">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Checkout flow
              </h2>
              <p className="text-sm text-slate-500">
                Negotiate through WhatsApp or a physical meetup, then jump
                directly to Razorpay.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Seller shares WhatsApp number and campus meetup point in the listing.",
              "Buyer negotiates first, then taps Pay on Razorpay.",
              "The app records the order and redirects straight to the seller's Razorpay payment link.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-white/90 px-4 py-3"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="marketplace-chat-section"
        className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]"
      >
        <div className="rounded-3xl border border-emerald-200 bg-white shadow-sm">
          <div className="border-b border-emerald-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Marketplace chats
                </h2>
                <p className="text-sm text-slate-500">
                  Persistent WhatsApp-style seller conversations
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto p-3">
            {threads.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
                <ShoppingBag className="mx-auto h-9 w-9 text-emerald-500" />
                <p className="mt-3 font-semibold text-slate-900">
                  No chats yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Tap Chat on any listing to open a live seller thread here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {threads.map((thread) => {
                  const lastMessage =
                    thread.messages[thread.messages.length - 1]?.text ?? "";

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => handleSelectThread(thread.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${
                        activeThreadId === thread.id
                          ? "border-emerald-400 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {thread.seller}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {thread.listingTitle}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {formatChatTime(thread.lastUpdatedAt)}
                        </span>
                      </div>
                      <p className="mt-2 truncate text-sm text-slate-600">
                        {typingThreadId === thread.id
                          ? "Typing..."
                          : lastMessage}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
          {activeThread && activeThreadListing ? (
            <>
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-sky-50 px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-600 p-3 text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {activeThread.seller}
                      </p>
                      <p className="text-sm text-slate-500">
                        {typingThreadId === activeThread.id
                          ? "Typing now"
                          : activeThread.sellerStatus === "online"
                            ? "Online and replying"
                            : "Will reply later"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-0 bg-white text-emerald-700">
                      {activeThread.listingTitle}
                    </Badge>
                    <Badge className="border-0 bg-white text-slate-700">
                      {formatMarketplacePrice(activeThreadListing)}
                    </Badge>
                    <Badge className="border-0 bg-white text-slate-700">
                      WhatsApp: {activeThreadListing.whatsappNumber}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-xs text-slate-600">
                  Meetup point: <strong>{activeThreadListing.meetupLocation}</strong>
                  {activeThreadListing.meetupNotes
                    ? ` • ${activeThreadListing.meetupNotes}`
                    : ""}
                </div>
              </div>

              <div className="h-[430px] overflow-y-auto bg-[linear-gradient(180deg,#ecfdf5_0%,#ffffff_28%,#f8fafc_100%)] px-4 py-5">
                <div className="space-y-3">
                  {activeThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "me"
                          ? "justify-end"
                          : message.sender === "system"
                            ? "justify-center"
                            : "justify-start"
                      }`}
                    >
                      {message.sender === "system" ? (
                        <div className="max-w-xl rounded-full bg-slate-200 px-4 py-2 text-center text-xs font-medium text-slate-700">
                          {message.text}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${
                            message.sender === "me"
                              ? "rounded-br-lg bg-emerald-500 text-white"
                              : "rounded-bl-lg border border-slate-200 bg-white text-slate-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.text}
                          </p>
                          <div
                            className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${
                              message.sender === "me"
                                ? "text-emerald-100"
                                : "text-slate-400"
                            }`}
                          >
                            <span>{formatChatTime(message.createdAt)}</span>
                            {message.sender === "me" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {typingThreadId === activeThread.id && (
                    <div className="flex justify-start">
                      <div className="rounded-3xl rounded-bl-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                        {activeThread.seller} is typing...
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-emerald-100 bg-white px-4 py-4">
                <div className="flex gap-3">
                  <Input
                    value={draftMessage}
                    onChange={(event) => setDraftMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Message ${activeThread.seller} about ${activeThread.listingTitle}`}
                    className="h-12 rounded-2xl border-emerald-200"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="h-12 rounded-2xl bg-emerald-600 px-5 text-white hover:bg-emerald-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[560px] flex-col items-center justify-center px-6 text-center">
              <MessageCircle className="h-12 w-12 text-emerald-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Open a conversation
              </h3>
              <p className="mt-2 max-w-md text-sm text-slate-500">
                Choose any listing and tap WhatsApp or Open In-App Chat to
                start negotiating with the seller.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={listingDialogOpen}
        onOpenChange={(open) => {
          setListingDialogOpen(open);
          if (!open) {
            resetListingDraft(listingDraft.type);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Marketplace Listing</DialogTitle>
            <DialogDescription>
              Publish a new sell or rent listing for students across campus.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marketplace-title">Title</Label>
                <Input
                  id="marketplace-title"
                  value={listingDraft.title}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Arduino starter kit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketplace-category">Category</Label>
                <select
                  id="marketplace-category"
                  value={listingDraft.category}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      category: event.target.value as MarketplaceCategory,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  {marketplaceCategories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="marketplace-type">Type</Label>
                <select
                  id="marketplace-type"
                  value={listingDraft.type}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      type: event.target.value as MarketplaceListingType,
                      pricingUnit:
                        event.target.value === "Rent"
                          ? previous.pricingUnit === "item"
                            ? "day"
                            : previous.pricingUnit
                          : "item",
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketplace-amount">Amount</Label>
                <Input
                  id="marketplace-amount"
                  type="number"
                  min="1"
                  value={listingDraft.amount}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketplace-unit">Pricing Unit</Label>
                <select
                  id="marketplace-unit"
                  disabled={listingDraft.type === "Sell"}
                  value={
                    listingDraft.type === "Sell"
                      ? "item"
                      : listingDraft.pricingUnit
                  }
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      pricingUnit: event.target.value as MarketplacePricingUnit,
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-100"
                >
                  <option value="item">Per item</option>
                  <option value="day">Per day</option>
                  <option value="week">Per week</option>
                  <option value="semester">Per semester</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketplace-description">Description</Label>
              <Textarea
                id="marketplace-description"
                value={listingDraft.description}
                onChange={(event) =>
                  setListingDraft((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Condition, accessories included, and best use case"
                className="min-h-[120px]"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="marketplace-whatsapp">WhatsApp Number</Label>
                <Input
                  id="marketplace-whatsapp"
                  value={listingDraft.whatsappNumber}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      whatsappNumber: event.target.value,
                    }))
                  }
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketplace-meetup">Meetup Location</Label>
                <Input
                  id="marketplace-meetup"
                  value={listingDraft.meetupLocation}
                  onChange={(event) =>
                    setListingDraft((previous) => ({
                      ...previous,
                      meetupLocation: event.target.value,
                    }))
                  }
                  placeholder="Innovation Lab Block"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketplace-meetup-notes">Meetup Notes</Label>
              <Input
                id="marketplace-meetup-notes"
                value={listingDraft.meetupNotes}
                onChange={(event) =>
                  setListingDraft((previous) => ({
                    ...previous,
                    meetupNotes: event.target.value,
                  }))
                }
                placeholder="Best time or negotiation notes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketplace-razorpay-link">
                Razorpay Payment Link
              </Label>
              <Input
                id="marketplace-razorpay-link"
                value={listingDraft.razorpayPaymentLink}
                onChange={(event) =>
                  setListingDraft((previous) => ({
                    ...previous,
                    razorpayPaymentLink: event.target.value,
                  }))
                }
                placeholder="https://rzp.io/l/your-payment-link"
              />
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              Seller will be shown as <strong>{currentStudentName}</strong>. New
              listings must include WhatsApp, meetup point, and a direct
              Razorpay payment link.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setListingDialogOpen(false);
                resetListingDraft(listingDraft.type);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateListing}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Publish Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
