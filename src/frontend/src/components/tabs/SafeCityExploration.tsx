import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type SafeCityCategory,
  type SafeCityPlace,
  WIT_SOLAPUR_ORIGIN,
  googleDirectionsFromWitUrl,
  googleMapsEmbedDirectionsUrl,
  googleMapsEmbedUrl,
  safeCityCategories,
} from "@/data/safeCitySolapurData";
import { ExternalLink, MapPin, ShieldCheck, Star } from "lucide-react";

function StarRating({ rating, accent }: { rating: number; accent: string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{
            fill: i <= rating ? "#f59e0b" : "#e5e7eb",
            color: i <= rating ? "#f59e0b" : "#d1d5db",
          }}
        />
      ))}
      <span className="text-xs font-bold ml-1" style={{ color: accent }}>
        {rating}/5
      </span>
    </div>
  );
}

function CrowdBadge({ type }: { type: SafeCityPlace["crowdType"] }) {
  const config = {
    Students: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
    Families: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
    Mixed: { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  };
  const c = config[type];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      👥 {type}
    </span>
  );
}

function PlaceCard({
  place,
  borderColor,
}: {
  place: SafeCityPlace;
  borderColor: string;
}) {
  const mapSrc = googleMapsEmbedDirectionsUrl(place.lat, place.lng);
  const openDirections = googleDirectionsFromWitUrl(place.lat, place.lng);

  return (
    <div
      className="rounded-2xl shadow-md relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
        borderLeft: `4px solid ${borderColor}`,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderLeftColor: borderColor,
        borderLeftWidth: "4px",
      }}
    >
      {place.collegeVerified && (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
            color: "#15803d",
            border: "1px solid #86efac",
          }}
        >
          <ShieldCheck className="w-3 h-3" />
          College Verified
        </div>
      )}

      <div className="relative h-40 w-full overflow-hidden bg-muted shrink-0">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        <p className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold drop-shadow-md line-clamp-2">
          {place.name}
        </p>
      </div>

      <div className="p-4 flex flex-col flex-1 min-h-0">
        <h4 className="font-bold text-sm text-gray-900 mb-1.5 pr-24 leading-tight">
          {place.name}
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          {place.description}
        </p>

        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mb-2">
          <p className="text-[10px] font-bold text-gray-600 px-2 py-1.5 bg-white/80 border-b border-gray-100 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-600 shrink-0" />
            Route: {WIT_SOLAPUR_ORIGIN.shortName} → this place (Google Maps)
          </p>
          <iframe
            title={`Directions to ${place.name}`}
            src={mapSrc}
            className="w-full h-[220px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mb-3 text-xs h-9 gap-1.5"
          asChild
        >
          <a
            href={openDirections}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="safe-city.open-directions"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open full directions in Google Maps
          </a>
        </Button>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-20 flex-shrink-0">
              Safety:
            </span>
            <StarRating rating={place.safetyRating} accent={borderColor} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-20 flex-shrink-0">
              Best Time:
            </span>
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(0,0,0,0.05)",
                color: "#374151",
              }}
            >
              🕐 {place.bestTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-20 flex-shrink-0">
              Crowd:
            </span>
            <CrowdBadge type={place.crowdType} />
          </div>
        </div>
      </div>
    </div>
  );
}

const totalPlaces = safeCityCategories.reduce(
  (n, c) => n + c.places.length,
  0,
);
const verifiedCount = safeCityCategories.reduce(
  (n, c) => n + c.places.filter((p) => p.collegeVerified).length,
  0,
);

export default function SafeCityExploration() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Banner */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #064e3b 0%, #065f46 25%, #0f766e 50%, #0891b2 75%, #1d4ed8 100%)",
          minHeight: 180,
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
            transform: "translateY(40%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 px-8 py-8 flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-start gap-6 flex-1">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              🗺️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                    color: "#15803d",
                    border: "1px solid #86efac",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  COLLEGE RECOMMENDED
                </Badge>
                <Badge
                  style={{
                    background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                    color: "#1e40af",
                    border: "1px solid #93c5fd",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  SOLAPUR CITY
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1 leading-tight">
                Safe City Exploration — Solapur
              </h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-2xl">
                College-verified safe places for freshers to explore, relax, and
                grow. Every map route{" "}
                <strong className="text-white">starts at WIT Solapur</strong>{" "}
                and ends at the listed destination. Photos are representative;
                verify hours before visiting.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[min(100%,380px)] shrink-0 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl bg-black/20">
            <p className="text-[10px] font-bold text-white/90 px-3 py-2 bg-black/30">
              Starting point: {WIT_SOLAPUR_ORIGIN.shortName}
            </p>
            <iframe
              title="Walchand Institute of Technology Solapur on Google Maps"
              src={googleMapsEmbedUrl(WIT_SOLAPUR_ORIGIN.lat, WIT_SOLAPUR_ORIGIN.lng, 16)}
              className="w-full h-[200px] lg:h-[220px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div
          className="relative z-10 mx-8 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
          style={{ marginTop: "-4px" }}
        >
          {[
            { label: "Total Places", value: String(totalPlaces), emoji: "📍" },
            {
              label: "Verified by College",
              value: String(verifiedCount),
              emoji: "✅",
            },
            {
              label: "Categories",
              value: String(safeCityCategories.length),
              emoji: "🗂️",
            },
            { label: "Safety Avg", value: "4.5★", emoji: "⭐" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-3 py-2 text-center"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div className="text-lg">{s.emoji}</div>
              <div className="text-white font-bold text-base leading-tight">
                {s.value}
              </div>
              <div className="text-white/70 text-[10px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)",
          border: "1px solid #a7f3d0",
        }}
      >
        <span className="text-xs font-bold text-gray-700 self-center">
          Legend:
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
              color: "#15803d",
              border: "1px solid #86efac",
            }}
          >
            <ShieldCheck className="w-3 h-3" /> College Verified
          </span>
          <span className="text-[11px] text-gray-500">
            — Officially vetted by WIT
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CrowdBadge type="Students" />
          <CrowdBadge type="Families" />
          <CrowdBadge type="Mixed" />
          <span className="text-[11px] text-gray-500">— Crowd type</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5"
                style={{ fill: "#f59e0b", color: "#f59e0b" }}
              />
            ))}
          </div>
          <span className="text-[11px] text-gray-500">
            — Safety rating (5 = Safest)
          </span>
        </div>
        <div className="w-full text-[11px] text-gray-600">
          <strong>Maps:</strong> Embedded routes use Google Maps (WIT →
          destination). Use &quot;Open full directions&quot; on your phone for
          live navigation.
        </div>
      </div>

      {/* Categories */}
      {safeCityCategories.map((cat: SafeCityCategory) => (
        <section key={cat.title}>
          <div
            className="rounded-2xl p-4 mb-5 flex items-center gap-3 shadow-lg"
            style={{ background: cat.gradient }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {cat.emoji}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {cat.title}
              </h2>
              <p className="text-white/80 text-xs">
                {cat.places.length} places ·{" "}
                {cat.places.filter((p) => p.collegeVerified).length} college
                verified
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cat.places.map((place) => (
              <PlaceCard
                key={place.name}
                place={place}
                borderColor={cat.borderColor}
              />
            ))}
          </div>
        </section>
      ))}

      <div
        className="rounded-2xl p-5 text-center"
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #dbeafe 100%)",
          border: "1px solid #a7f3d0",
        }}
      >
        <div className="text-2xl mb-2">🛡️</div>
        <h3 className="font-bold text-gray-800 mb-1">Stay Safe, Stay Smart</h3>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          These places are recommended and periodically reviewed by Walchand
          Institute of Technology. Map pins are approximate — always confirm the
          venue before you travel. If you find a place unsafe, report it through
          the Scam Alert Board.
        </p>
      </div>
    </div>
  );
}
