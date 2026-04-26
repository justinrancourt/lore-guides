import { useState } from "react";

// ─── Tokens ─────────────────────────────────────────────────────────────────
const C = {
  canvas: "#FAF8F5", surface: "#F2EDE6", sunken: "#EDE7DE",
  ink: "#2D2A26", inkMuted: "#4A4540", inkFaint: "#9C8E7C",
  accent: "#C17C4E", accentWarm: "#D4A574", accentDeep: "#9B5E38",
  sage: "#7A8B5E", sageMuted: "#A8B890",
  border: "#E8E4DF", borderSoft: "#F0EBE4", borderBold: "#D0C8BE",
};
const serif = "'Georgia', 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// ─── Data ───────────────────────────────────────────────────────────────────
const GUIDES = [
  {
    id: "valencia", city: "Valencia", country: "Spain",
    count: 8, year: "2019", context: "Lived there",
    dotColor: C.accent,
    intro: "I lived here for two months in the fall of 2019. Valencia is one of those cities that doesn't try to impress you.",
    places: [
      { id: 1, name: "Mercado Central", neighborhood: "Ciutat Vella", category: "SEE", note: "Go on a weekday. Don't eat breakfast first. Wander until something pulls you in. Buy a bag of clementines and eat them on the steps outside.", hasPhoto: true, photoColor: "#8B6F4E", date: "Oct 12" },
      { id: 2, name: "La Más Bonita", neighborhood: "Malvarrosa Beach", category: "EAT", note: "Walk here before 9am when the beach is empty. Order the fresh orange juice and the tostada con tomate. Sit outside. Watch the Mediterranean do its thing.", hasPhoto: false, photoColor: "#D4A574", date: "Oct 12" },
      { id: 3, name: "Jardín del Turia", neighborhood: "Crosses the city", category: "DO", note: "A river that became the most beautiful urban park in Europe. Rent a bike and ride the full 9km. You'll pass under medieval bridges, through orange groves.", hasPhoto: false, photoColor: "#7A8B5E", date: "Oct 11" },
      { id: 4, name: "Horchatería Daniel", neighborhood: "Alboraya", category: "DRINK", note: "Take the tram to Alboraya. Order horchata and fartons. This is THE horchata — made from tiger nuts grown in the fields you can see from the window.", hasPhoto: false, photoColor: "#C9B896", date: "Oct 11" },
      { id: 5, name: "Bodega Casa Montaña", neighborhood: "El Cabanyal", category: "DRINK", note: "The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner.", hasPhoto: false, photoColor: "#6B4E3D", date: "Oct 10" },
      { id: 6, name: "Café de las Horas", neighborhood: "El Carmen", category: "DRINK", note: "Baroque, candlelit, a little dramatic. Order the Agua de Valencia. Go after 10pm when the neighborhood comes alive.", hasPhoto: false, photoColor: "#4A3728", date: "Oct 10" },
      { id: 7, name: "Albufera Natural Park", neighborhood: "South of the city", category: "DO", note: "This is where paella was born. Take a boat through the wetlands at sunset, then eat arroz in one of the restaurants in El Palmar.", hasPhoto: false, photoColor: "#B08968", date: "Oct 9" },
      { id: 8, name: "La Pepica", neighborhood: "Malvarrosa Beach", category: "EAT", note: "The paella here is what paella is supposed to taste like. Sit on the terrace. You'll understand.", hasPhoto: false, photoColor: "#C4A070", date: "Oct 9" },
    ],
  },
  {
    id: "south-florida", city: "South Florida", country: "USA",
    count: 2, year: "Ongoing", context: "Home",
    dotColor: C.sage,
    intro: "The spots I'd send you to if you visited me.",
    places: [
      { id: 9, name: "Bennys", neighborhood: "Lake Worth Beach", category: "DRINK", note: "We love going here.", hasPhoto: false, photoColor: "#7A8B5E", date: "Apr 24" },
      { id: 10, name: "Lake Worth Beach Pier", neighborhood: "Lake Worth Beach", category: "", note: "", hasPhoto: true, photoColor: "#8B7B6B", date: "Apr 24" },
    ],
  },
];

const SHARED_GUIDES = [
  { id: "tokyo", city: "Tokyo", country: "Japan", count: 9, author: "Sarah", dotColor: "#8B4E6B" },
  { id: "barcelona", city: "Barcelona", country: "Spain", count: 6, author: "Marco", dotColor: "#6B7A4E" },
];

// ─── Components ─────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span style={{ fontFamily: serif, fontSize: "14px", color: C.ink, letterSpacing: "0.08em" }}>Lore</span>
    </div>
  );
}

function GuideDot({ color: dotColor, size = 7 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }} />;
}

function PhotoThumb({ photoColor, hasPhoto, size = 52 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "3px",
      backgroundColor: photoColor, flexShrink: 0,
      overflow: "hidden", position: "relative",
    }}>
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(145deg, ${photoColor}ee, ${photoColor})`,
      }} />
      {hasPhoto && (
        <div style={{ position: "absolute", bottom: 3, right: 3 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Guide Item ─────────────────────────────────────────────────────
function SidebarGuide({ guide, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 16px",
        backgroundColor: isActive ? C.surface : "transparent",
        border: "none", borderRadius: "3px",
        cursor: "pointer",
        transition: "background-color 0.12s",
        textAlign: "left",
      }}
    >
      <GuideDot color={guide.dotColor} size={8} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: serif, fontSize: "14px",
          color: isActive ? C.ink : C.inkMuted,
          margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontWeight: 400,
        }}>{guide.city}</p>
        <p style={{
          fontFamily: serif, fontSize: "11px",
          color: C.inkFaint,
          margin: 0, fontStyle: "italic",
        }}>{guide.count} places</p>
      </div>
    </button>
  );
}

function SidebarSharedGuide({ guide }) {
  return (
    <button style={{
      width: "100%",
      display: "flex", alignItems: "center", gap: "10px",
      padding: "8px 16px",
      backgroundColor: "transparent",
      border: "none", borderRadius: "3px",
      cursor: "pointer",
      textAlign: "left",
      opacity: 0.7,
    }}>
      <GuideDot color={guide.dotColor} size={7} />
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: serif, fontSize: "13px", color: C.inkMuted, margin: 0 }}>{guide.city}</p>
        <p style={{ fontFamily: serif, fontSize: "10px", color: C.inkFaint, margin: 0, fontStyle: "italic" }}>from {guide.author}</p>
      </div>
    </button>
  );
}

// ─── Place Row (main content) ───────────────────────────────────────────────
function PlaceRow({ place, showGuide = false, guideColor }) {
  const [hovered, setHovered] = useState(false);
  const isUnannotated = !place.note;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: "14px", alignItems: "flex-start",
        padding: "16px 0",
        borderBottom: `1px solid ${C.borderSoft}`,
        cursor: "pointer",
        backgroundColor: hovered ? "#FDFCFA" : "transparent",
        transition: "background-color 0.12s",
      }}
    >
      <PhotoThumb photoColor={place.photoColor} hasPhoto={place.hasPhoto} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
          <h3 style={{ fontFamily: serif, fontSize: "15px", fontWeight: 400, color: C.ink, margin: 0 }}>{place.name}</h3>
          {place.category && (
            <span style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", color: C.inkFaint, flexShrink: 0 }}>{place.category}</span>
          )}
        </div>
        <p style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint, fontStyle: "italic", margin: "1px 0 0" }}>
          {place.neighborhood}{place.date ? ` · ${place.date}` : ""}
        </p>
        {place.note && (
          <p style={{
            fontFamily: serif, fontSize: "13px", color: C.inkMuted, lineHeight: 1.6,
            margin: "6px 0 0",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{place.note}</p>
        )}
        {isUnannotated && (
          <p style={{ fontFamily: serif, fontSize: "12px", color: C.accentDeep, margin: "6px 0 0", fontStyle: "italic", opacity: 0.7 }}>
            Needs a note
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel (right side) ──────────────────────────────────────────────
function DetailPanel({ guide }) {
  return (
    <div style={{ padding: "28px 24px" }}>
      {/* Guide header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <GuideDot color={guide.dotColor} size={9} />
          <span style={{ fontFamily: sans, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{guide.context || guide.year}</span>
        </div>
        <h2 style={{ fontFamily: serif, fontSize: "22px", fontWeight: 400, color: C.ink, margin: "0 0 4px" }}>{guide.city}</h2>
        <p style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint, fontStyle: "italic", margin: "0 0 14px" }}>
          {guide.count} places · {guide.year}
        </p>
        {guide.intro && (
          <p style={{ fontFamily: serif, fontSize: "13px", color: C.inkMuted, lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
            "{guide.intro}"
          </p>
        )}
      </div>

      <div style={{ width: "24px", height: "1px", backgroundColor: C.accent, margin: "0 0 20px" }} />

      {/* Quick stats */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
        {[
          { label: "Places", value: guide.count },
          { label: "With notes", value: guide.places.filter(p => p.note).length },
          { label: "With photos", value: guide.places.filter(p => p.hasPhoto).length },
        ].map((stat, i) => (
          <div key={i}>
            <p style={{ fontFamily: serif, fontSize: "20px", color: C.ink, margin: "0 0 1px" }}>{stat.value}</p>
            <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkFaint, margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button style={{
          width: "100%", padding: "10px 16px",
          backgroundColor: C.accent, border: "none", borderRadius: "2px",
          fontFamily: serif, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share guide
        </button>
        <button style={{
          width: "100%", padding: "10px 16px",
          backgroundColor: "transparent", border: `1px solid ${C.border}`, borderRadius: "2px",
          fontFamily: serif, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
          color: C.ink, cursor: "pointer",
        }}>
          Edit guide settings
        </button>
      </div>

      {/* Map preview placeholder */}
      <div style={{
        marginTop: "24px",
        height: "160px",
        backgroundColor: "#EFE8DC",
        borderRadius: "3px",
        border: `1px solid ${C.borderBold}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "30%", height: "100%", backgroundColor: "#D9E8EC", opacity: 0.4 }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.5" />
          <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
          <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.3" />
        </svg>
        {/* Pins */}
        {[{ x: "25%", y: "30%" }, { x: "55%", y: "55%" }, { x: "35%", y: "70%" }, { x: "60%", y: "25%" }].map((pin, i) => (
          <div key={i} style={{
            position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -50%)",
            width: 14, height: 14, borderRadius: "50%",
            backgroundColor: guide.dotColor,
            border: "1.5px solid #F0EAE0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }} />
        ))}
        <span style={{ position: "absolute", bottom: 6, right: 8, fontFamily: sans, fontSize: "7px", color: "#B8AFA4", opacity: 0.5 }}>Mapbox</span>
      </div>

      {/* Categories breakdown */}
      <div style={{ marginTop: "24px" }}>
        <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, margin: "0 0 10px" }}>By category</p>
        {Object.entries(
          guide.places.reduce((acc, p) => {
            const cat = p.category || "Uncategorized";
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {})
        ).map(([cat, count]) => (
          <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontFamily: serif, fontSize: "12px", color: C.inkMuted }}>{cat}</span>
            <span style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── All Places Panel (right side — map + stats overview) ───────────────────
function AllPlacesPanel({ allPlaces, guides }) {
  const withNotes = allPlaces.filter(p => p.note).length;
  const withPhotos = allPlaces.filter(p => p.hasPhoto).length;
  const needNotes = allPlaces.filter(p => !p.note).length;

  return (
    <div style={{ padding: "28px 24px" }}>
      {/* Map showing all places */}
      <div style={{
        height: "200px",
        backgroundColor: "#EFE8DC",
        borderRadius: "3px",
        border: `1px solid ${C.borderBold}`,
        position: "relative",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "45%", backgroundColor: "#D9E8EC", opacity: 0.35, borderRadius: "0 0 0 40%" }} />
        <div style={{ position: "absolute", bottom: 0, left: "15%", width: "25%", height: "30%", backgroundColor: "#D9E8EC", opacity: 0.25, borderRadius: "40% 40% 0 0" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.3" />
          <line x1="35%" y1="0" x2="35%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.3" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.25" />
        </svg>
        {guides.map((g, gi) => {
          const positions = [
            [{ x: "30%", y: "35%" }, { x: "38%", y: "28%" }, { x: "25%", y: "45%" }, { x: "42%", y: "50%" }],
            [{ x: "70%", y: "65%" }, { x: "75%", y: "72%" }],
          ];
          return (positions[gi] || []).map((pin, pi) => (
            <div key={`${gi}-${pi}`} style={{
              position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -50%)",
              width: 12, height: 12, borderRadius: "50%",
              backgroundColor: g.dotColor,
              border: "1.5px solid #F0EAE0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              opacity: 0.85,
            }} />
          ));
        })}
        <div style={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: "10px" }}>
          {guides.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: g.dotColor }} />
              <span style={{ fontFamily: sans, fontSize: "8px", color: C.inkFaint }}>{g.city}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, margin: "0 0 12px", fontWeight: 600 }}>Overview</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { value: allPlaces.length, label: "Total places" },
            { value: guides.length, label: "Guides" },
            { value: withNotes, label: "With notes" },
            { value: withPhotos, label: "With photos" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "12px", backgroundColor: C.surface, borderRadius: "3px" }}>
              <p style={{ fontFamily: serif, fontSize: "20px", color: C.ink, margin: "0 0 2px" }}>{stat.value}</p>
              <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: C.inkFaint, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Needs attention */}
      {needNotes > 0 && (
        <div style={{
          padding: "14px 16px",
          backgroundColor: "#FDF8F2",
          border: `1px solid ${C.accentWarm}40`,
          borderRadius: "3px",
          marginBottom: "24px",
        }}>
          <p style={{ fontFamily: serif, fontSize: "13px", color: C.accentDeep, margin: "0 0 3px" }}>
            {needNotes} {needNotes === 1 ? "place" : "places"} without notes
          </p>
          <p style={{ fontFamily: serif, fontSize: "11px", color: C.inkFaint, fontStyle: "italic", margin: 0 }}>
            A place without your note is just a pin.
          </p>
        </div>
      )}

      {/* By guide */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, margin: "0 0 10px", fontWeight: 600 }}>By guide</p>
        {guides.map(g => {
          const pct = Math.round((g.places.length / allPlaces.length) * 100);
          return (
            <div key={g.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <GuideDot color={g.dotColor} size={7} />
                  <span style={{ fontFamily: serif, fontSize: "13px", color: C.ink }}>{g.city}</span>
                </div>
                <span style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint }}>{g.places.length}</span>
              </div>
              <div style={{ height: "3px", backgroundColor: C.borderSoft, borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", backgroundColor: g.dotColor, borderRadius: "2px" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* By category */}
      <div>
        <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint, margin: "0 0 10px", fontWeight: 600 }}>By category</p>
        {Object.entries(
          allPlaces.reduce((acc, p) => {
            const cat = p.category || "Unfiled";
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
          <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontFamily: serif, fontSize: "12px", color: C.inkMuted }}>{cat}</span>
            <span style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT — THREE COLUMN LAYOUT
// ═══════════════════════════════════════════════════════════════════════════
export default function AuthorHome() {
  const [activeGuide, setActiveGuide] = useState("valencia");
  const [allPlacesView, setAllPlacesView] = useState(true);
  const [guideFilter, setGuideFilter] = useState("ALL");

  const currentGuide = GUIDES.find(g => g.id === activeGuide);
  const allPlaces = GUIDES.flatMap(g => g.places.map(p => ({ ...p, guideId: g.id, guideName: g.city, guideColor: g.dotColor })));

  const displayedPlaces = allPlacesView
    ? (guideFilter === "ALL" ? allPlaces : allPlaces.filter(p => p.guideId === guideFilter))
    : currentGuide.places;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: C.canvas, fontFamily: serif, overflow: "hidden" }}>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div style={{
        width: "220px", minWidth: "200px",
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        backgroundColor: C.canvas,
        overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px" }}>
          <Logo />
        </div>

        {/* All Places — primary nav item */}
        <div style={{ padding: "0 8px", marginBottom: "4px" }}>
          <button
            onClick={() => { setAllPlacesView(true); setGuideFilter("ALL"); }}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 16px",
              backgroundColor: allPlacesView ? C.surface : "transparent",
              border: "none", borderRadius: "3px",
              cursor: "pointer", textAlign: "left",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={allPlacesView ? C.ink : C.inkFaint} strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <div style={{ flex: 1 }}>
              <span style={{ fontFamily: serif, fontSize: "14px", color: allPlacesView ? C.ink : C.inkMuted, display: "block" }}>All places</span>
              <span style={{ fontFamily: serif, fontSize: "11px", color: C.inkFaint, fontStyle: "italic" }}>{GUIDES.flatMap(g => g.places).length} saved</span>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div style={{ width: "calc(100% - 32px)", height: "1px", backgroundColor: C.border, margin: "4px 16px 12px" }} />

        {/* My Guides */}
        <div style={{ padding: "0 8px", marginBottom: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", marginBottom: "6px" }}>
            <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, margin: 0, fontWeight: 600 }}>Guides</p>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: C.accent, fontFamily: serif, fontSize: "16px", lineHeight: 1 }}>+</button>
          </div>
          {GUIDES.map(g => (
            <SidebarGuide
              key={g.id}
              guide={g}
              isActive={activeGuide === g.id && !allPlacesView}
              onClick={() => { setActiveGuide(g.id); setAllPlacesView(false); }}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "calc(100% - 32px)", height: "1px", backgroundColor: C.border, margin: "8px 16px 12px" }} />

        {/* Shared with me */}
        <div style={{ padding: "0 8px" }}>
          <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkFaint, margin: "0 8px 6px", fontWeight: 600 }}>Shared with me</p>
          {SHARED_GUIDES.map(g => (
            <SidebarSharedGuide key={g.id} guide={g} />
          ))}
        </div>

        {/* Bottom spacer */}
        <div style={{ flex: 1 }} />

        {/* User */}
        <div style={{ padding: "16px", borderTop: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: serif, fontSize: "12px", color: "#fff" }}>J</span>
          </div>
          <span style={{ fontFamily: serif, fontSize: "13px", color: C.inkMuted }}>Justin</span>
        </div>
      </div>

      {/* ═══ CENTER — PLACE LIST ═══ */}
      <div style={{
        flex: 1,
        minWidth: "360px",
        overflowY: "auto",
        borderRight: `1px solid ${C.border}`,
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px 20px",
          borderBottom: `1px solid ${C.border}`,
          position: "sticky", top: 0,
          backgroundColor: C.canvas, zIndex: 10,
        }}>
          {allPlacesView ? (
            <>
              <h1 style={{ fontFamily: serif, fontSize: "22px", fontWeight: 400, color: C.ink, margin: "0 0 3px" }}>Every place I've saved</h1>
              <p style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint, fontStyle: "italic", margin: "0 0 14px" }}>
                {allPlaces.length} places · {allPlaces.filter(p => !p.note).length} need notes
              </p>
              {/* Guide filter pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { key: "ALL", label: "All", dotColor: null },
                  ...GUIDES.map(g => ({ key: g.id, label: g.city, dotColor: g.dotColor })),
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setGuideFilter(f.key)}
                    style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      border: guideFilter === f.key ? `1px solid ${C.ink}` : `1px solid ${C.border}`,
                      backgroundColor: guideFilter === f.key ? C.ink : "transparent",
                      color: guideFilter === f.key ? "#fff" : C.inkFaint,
                      fontFamily: sans, fontSize: "10px", letterSpacing: "0.06em", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 0.12s",
                    }}
                  >
                    {f.dotColor && <GuideDot color={guideFilter === f.key ? "#fff" : f.dotColor} size={6} />}
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <GuideDot color={currentGuide.dotColor} size={9} />
                <h1 style={{ fontFamily: serif, fontSize: "22px", fontWeight: 400, color: C.ink, margin: 0 }}>{currentGuide.city}</h1>
              </div>
              <p style={{ fontFamily: serif, fontSize: "12px", color: C.inkFaint, fontStyle: "italic", margin: 0 }}>
                {currentGuide.count} places · {currentGuide.year}
              </p>
            </>
          )}
        </div>

        {/* Place list */}
        <div style={{ padding: "4px 28px" }}>
          {displayedPlaces.map((place, i) => (
            <div key={`${place.id}-${i}`}>
              {/* Guide section headers in All Places view */}
              {allPlacesView && guideFilter === "ALL" && (
                (i === 0 || place.guideId !== displayedPlaces[i - 1].guideId) && (
                  <div style={{ padding: i === 0 ? "12px 0 4px" : "20px 0 4px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <GuideDot color={place.guideColor} size={6} />
                    <span style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkFaint }}>{place.guideName}</span>
                    <span style={{ fontFamily: sans, fontSize: "9px", color: C.inkFaint, opacity: 0.5 }}>
                      · {allPlaces.filter(p => p.guideId === place.guideId).length}
                    </span>
                  </div>
                )
              )}
              <PlaceRow place={place} />
            </div>
          ))}

          {/* Add place */}
          <div style={{
            padding: "20px 0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            cursor: "pointer",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.inkFaint} strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span style={{ fontFamily: serif, fontSize: "13px", color: C.inkFaint }}>Add a place</span>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{
        width: "300px", minWidth: "260px",
        overflowY: "auto",
        backgroundColor: C.canvas,
      }}>
        {allPlacesView ? (
          <AllPlacesPanel allPlaces={allPlaces} guides={GUIDES} />
        ) : (
          <DetailPanel guide={currentGuide} />
        )}
      </div>
    </div>
  );
}
