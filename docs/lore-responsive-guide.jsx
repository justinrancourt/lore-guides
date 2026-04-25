import { useState, useEffect } from "react";

// ─── Tokens (from existing design system) ───────────────────────────────────
const color = {
  canvas: "#FAF8F5", surface: "#F2EDE6", sunken: "#EDE7DE",
  ink: "#2D2A26", inkMuted: "#4A4540", inkFaint: "#9C8E7C",
  accent: "#C17C4E", accentWarm: "#D4A574", accentDeep: "#9B5E38",
  sage: "#7A8B5E", sageMuted: "#A8B890",
  border: "#E8E4DF", borderSoft: "#F0EBE4", borderBold: "#D0C8BE",
  onAccent: "#FFFFFF",
};
const serif = "'Georgia', 'Times New Roman', serif";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const PHOTOS = {
  beach: "data:image/jpeg;base64,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",
  market: "data:image/jpeg;base64,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",
  bar: "data:image/jpeg;base64,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",
  park: "data:image/jpeg;base64,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",
  cafe: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCADIASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDpcUU7FJiuI6RMUUuKMUAJikxT8UmKAEFGKUCjFACUlPxSYpgNxS4pcUUgEoxTsUUANxSYp2KMUwG0uKXFLikAzFKBS4pcUANxS4pcUuKAEApaXFGKACjFLilApBYTFGKdijFAABS0ClxQAlKBS4oxSATFLilxS4oASlxS4oAoATFLS4oxSAqUYpaMVYCYoxTqMUANxRinEUmKBiYoxTsUYoENxRinYoxQMTFJinUYoENxRinUUANxRinUYoAbiinYoxQA3FGKdiigYmKMU6igBBS4paUUgACilpQKAExRilxS0gExS4oApwFACYoxS4pcUAJigClxS4pAJilApcUYoAKWjFLigLFKlpcUlUAUlOpKYBRRS4pAFJS0UAJRilpM0wCijFLSASilpKYBRRRSAMUUtFACYoxS0UwAUUUtIAxRilpRQAmKWiloAKKKXFIBaKBS0AFKKSlFAC0uKSlpAFLiiloASlopaQFKiikxVgLRRRmgAoopKAFpM0tFABRRRQAUUUlMApaKSgAoopaACikoFABS0lLQAUtJS0gFpaSgUAOpabS0gFpaTpRmgBaWkpaAFxRRmlzSAKWkpaAClFFFAxaWikpAUs0ZpKStBDs0maKKAFFFJmjNAC0ZpKM0ALRSZpaAFzSZpKBQAuaKQ0ZoAWikzRmgBaM0lFAC0CkozQA6lFNzRmkA+jNNzSg0AOzSg03NKKAHUA03NLmkA7NFJmloAXNLmm0uaAHA0uabRmkA6lptLmgB1JmkzS0AUM0ZpKDxViFzS03NGaAFopM0ZoAdmkzSZozQA7NJmkzRQA7NGc1PBatLz2q4tpGn3iKpRYrozMGk5rV8uD1FIbWJ/ukU+UXMZmaKsz2hj5HSqh4NS1Yq9x1JmkzRSAdmkzSZozQA6lptLmgB2aUUylzSAdmlzTc0UAPzRmm5pc0DH5oBpmaXNIQ/NFNzRmgY/NLTAaXNADxS5pgNKDSAdmikzRQBQzRmm5ozWhI7NGabmjNADgaM03NGaAHZozTc0ZoAdmnxYLjNRZpQ2KANkuI4AUrPkndjyaWK6wu1ulOIjfkGnK72EtCDzG9aek7qeDTvKX1pwSNepqbMdy7DL5sR31mXGBIcVLJdALtSqjMScmqb0Ehc0ZpuaKQx2aM03NGaAH5ozTM0ZpAP3Uu6o80ZpgSb6N9R0UrASb6XfUWaM0WC5L5lL5lQ0UWAm8yjzahzRmiwybzaXzqgzRmiwix51HnVXzRmiwyx59L59Vs0ZosIbmjNNzRmmIdmjNNzRQMdmjNNzRmgQ7NFNzRQA7NGabmjNAx2aUOR3plFAEnmN60hcnvTM0ZoEOzRmkzSUAOzRmkzSZoAdmjNNzRQAuaXNNozQMdRmm5pc0CFzRmm0uaAFzRmkpKAH5pM03NLmgYuaKbmjNADs0ZpuaXNAC0U3NFAh2aM03NGaAJ/s5pPs5q5ijFOwFP7OaPs5q5ijFFgKf2c0fZzVzFGKYFT7OaPs5q3ijFFgKf2c0fZzVzFGKAKf2c0fZzVzFGKLAU/s5o+zmrmKMUrAU/s5o+zmrmKMUWAqfZzR9nNW8UYp2Ap/ZzR9nNXMUYosBU+zmk+zmrmKMUrAU/s5o+zmrmKMUWAp/ZzR9nNXMUYosBT+zmj7OauYoxRYCn9nNH2c1cxRimBT+zmj7OauYoxSsBT+zmj7OauYoxTAp/ZzR9nNXMUYpWAqfZzSfZzVzFGKYC5ozRRQIM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAM0ZoooAKKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBaKSigBcUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooAMUYoooA//Z",
  cocktail: "data:image/jpeg;base64,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",
  wetlands: "data:image/jpeg;base64,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",
};


// ─── Guide data ─────────────────────────────────────────────────────────────
const GUIDE = {
  city: "Valencia", country: "Spain",
  author: "Justin", slug: "justin-valencia",
  intro: "I lived here for two months in the fall of 2019. Valencia is one of those cities that doesn't try to impress you — it just quietly becomes the best place you've ever been.",
  year: "2019", context: "Lived there", placeCount: 7,
  places: [
    { id: 1, name: "La Más Bonita", category: "Morning", neighborhood: "Malvarrosa Beach", note: "Walk here before 9am when the beach is empty. Order the fresh orange juice and the tostada con tomate. Sit outside. Watch the Mediterranean do its thing.", vibe: "Golden hour breakfast", timeSensitive: "Best before 9am", photoColor: "#D4A574", photo: PHOTOS.beach },
    { id: 2, name: "Mercado Central", category: "Morning", neighborhood: "Ciutat Vella", note: "Go on a weekday. Don't eat breakfast first. Wander until something pulls you in. Buy a bag of clementines and eat them on the steps outside.", vibe: "Sensory overload in the best way", photoColor: "#8B6F4E", photo: PHOTOS.market },
    { id: 3, name: "Bodega Casa Montaña", category: "Evening", neighborhood: "El Cabanyal", note: "The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner.", vibe: "The real thing", timeSensitive: "Opens at 7pm", photoColor: "#6B4E3D", photo: PHOTOS.bar },
    { id: 4, name: "Jardín del Turia", category: "Afternoon", neighborhood: "Crosses the whole city", note: "A river that became the most beautiful urban park in Europe. Rent a bike and ride the full 9km.", vibe: "The soul of the city", photoColor: "#7A8B5E", photo: PHOTOS.park },
    { id: 5, name: "Horchatería Daniel", category: "Afternoon", neighborhood: "Alboraya", note: "Take the tram to Alboraya. Order horchata and fartons. This is THE horchata — made from tiger nuts grown in the fields you can see from the window.", vibe: "A flavor you can't find at home", photoColor: "#C9B896", photo: PHOTOS.cafe },
    { id: 6, name: "Café de las Horas", category: "Evening", neighborhood: "El Carmen", note: "Baroque, candlelit, a little dramatic. Order the Agua de Valencia. Go after 10pm when the neighborhood comes alive.", vibe: "Where the night begins", timeSensitive: "Best after 10pm", photoColor: "#4A3728", photo: PHOTOS.cocktail },
    { id: 7, name: "Albufera Natural Park", category: "Day Trip", neighborhood: "South of the city", note: "This is where paella was born. Take a boat through the wetlands at sunset, then eat arroz in one of the restaurants in El Palmar.", vibe: "Where paella comes from", photoColor: "#B08968", photo: PHOTOS.wetlands },
  ],
};

// ─── Shared Components ──────────────────────────────────────────────────────
function Logo({ size = 13 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color.ink} strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span style={{ fontFamily: serif, fontSize: size + 1, color: color.ink, letterSpacing: "0.08em" }}>Lore Guides</span>
    </div>
  );
}

function Divider({ width = 32, margin = "28px auto" }) {
  return <div style={{ width, height: "1px", backgroundColor: color.accent, margin }} />;
}

function PhotoBlock({ photoColor, photo, height = 140 }) {
  return (
    <div style={{ width: "100%", height, backgroundColor: photoColor || "#D4A574", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
      {photo && (
        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}
      {/* Warm color wash */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${photoColor}30 0%, transparent 50%, ${photoColor}20 100%)`, mixBlendMode: "multiply" }} />
      {/* Subtle vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)" }} />
    </div>
  );
}

function MapPlaceholder({ height = 200, style: extraStyle = {} }) {
  return (
    <div style={{
      height,
      backgroundColor: "#F0EAE0",
      position: "relative",
      overflow: "hidden",
      ...extraStyle,
    }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "35%", height: "100%", backgroundColor: "#D9E8EC", opacity: 0.5 }} />
      <div style={{ position: "absolute", top: 0, right: "33%", width: "8%", height: "100%", background: "linear-gradient(90deg, transparent, #D9E8EC50)", opacity: 0.5 }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.6" />
        <line x1="0" y1="78%" x2="100%" y2="78%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.5" />
        <line x1="55%" y1="0" x2="55%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.4" />
        <line x1="72%" y1="0" x2="72%" y2="100%" stroke="#D8D0C4" strokeWidth="0.5" opacity="0.3" />
        <path d="M0 40 Q80 55 160 35 Q240 20 350 50" stroke="#CADBD5" strokeWidth="2.5" fill="none" opacity="0.4" />
      </svg>
      {/* Neighborhood labels */}
      <span style={{ position: "absolute", top: "18%", left: "12%", fontFamily: sans, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8AFA4", opacity: 0.7 }}>El Carmen</span>
      <span style={{ position: "absolute", top: "45%", left: "8%", fontFamily: sans, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8AFA4", opacity: 0.7 }}>Ciutat Vella</span>
      <span style={{ position: "absolute", top: "28%", right: "38%", fontFamily: sans, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8AFA4", opacity: 0.7 }}>Ruzafa</span>
      <span style={{ position: "absolute", bottom: "18%", right: "42%", fontFamily: sans, fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8AFA4", opacity: 0.6 }}>El Cabanyal</span>

      {/* Pins */}
      {[
        { x: "72%", y: "18%" }, { x: "28%", y: "52%" }, { x: "58%", y: "68%" },
        { x: "22%", y: "30%" }, { x: "46%", y: "12%" }, { x: "24%", y: "42%" }, { x: "36%", y: "88%" },
      ].map((pin, i) => (
        <div key={i} style={{
          position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -50%)",
          width: "18px", height: "18px", borderRadius: "50%",
          backgroundColor: i === 2 ? color.accent : "#8C7B6B",
          border: i === 2 ? "2px solid #fff" : "1.5px solid #F0EAE0",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: i === 2 ? "0 2px 8px rgba(193,124,78,0.3)" : "0 1px 3px rgba(0,0,0,0.12)",
          cursor: "pointer", zIndex: i === 2 ? 2 : 1,
        }}>
          <span style={{ fontFamily: sans, fontSize: "8px", fontWeight: 600, color: "#fff" }}>{i + 1}</span>
        </div>
      ))}
      <span style={{ position: "absolute", bottom: "6px", right: "8px", fontFamily: sans, fontSize: "7px", color: "#B8AFA4", opacity: 0.5 }}>Mapbox</span>
    </div>
  );
}


// ─── Annotation Pill ────────────────────────────────────────────────────────
function Annotation({ children, color: c = "#E8433A", top, left, right, bottom }) {
  return (
    <div style={{
      position: "absolute", top, left, right, bottom,
      backgroundColor: c + "18", border: `1px solid ${c}60`,
      borderRadius: "3px", padding: "4px 8px",
      fontFamily: sans, fontSize: "9px", color: c,
      letterSpacing: "0.03em", lineHeight: 1.3,
      maxWidth: "180px", zIndex: 30, whiteSpace: "normal",
      pointerEvents: "none",
    }}>
      {children}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 1: Recipient Landing — Desktop (Side-by-side map + list)
// ═══════════════════════════════════════════════════════════════════════════
function DesktopLandingScreen() {
  const [expanded, setExpanded] = useState(3);
  const categories = ["All", "Morning", "Afternoon", "Evening", "Day Trip"];
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? GUIDE.places : GUIDE.places.filter(p => p.category === activeCat);

  return (
    <div style={{ backgroundColor: color.canvas, minHeight: "100%", fontFamily: serif }}>
      {/* ── Desktop Nav ── */}
      <div style={{
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid " + color.border,
        position: "sticky", top: 0, backgroundColor: color.canvas, zIndex: 20,
      }}>
        <Logo size={14} />
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: serif, fontSize: "12px", color: color.inkFaint, fontStyle: "italic" }}>
            {GUIDE.placeCount} places · {GUIDE.year}
          </span>
          <button style={{
            background: color.accent, border: "none", borderRadius: "2px",
            padding: "9px 18px", fontFamily: serif, fontSize: "11px",
            letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            I'm here
          </button>
        </div>
      </div>

      {/* ── Split Layout: List (left) + Map (right) ── */}
      <div style={{ display: "flex", height: "calc(100vh - 52px)" }}>

        {/* ── Left Panel: Guide content ── */}
        <div style={{
          width: "420px", minWidth: "380px", maxWidth: "480px",
          borderRight: "1px solid " + color.border,
          overflowY: "auto",
          backgroundColor: color.canvas,
        }}>
          {/* Cover / Header */}
          <div style={{ textAlign: "center", padding: "40px 32px 24px" }}>
            <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: color.accent, margin: "0 0 12px" }}>A guide by {GUIDE.author}</p>
            <h1 style={{ fontFamily: serif, fontSize: "28px", fontWeight: "400", color: color.ink, margin: "0 0 4px", lineHeight: 1.2 }}>
              {GUIDE.city}
            </h1>
            <p style={{ fontFamily: serif, fontSize: "14px", color: color.inkFaint, margin: "0 0 6px" }}>{GUIDE.country}</p>
            <Divider />
            <p style={{ fontFamily: serif, fontSize: "14px", fontStyle: "italic", color: color.inkMuted, lineHeight: 1.8, margin: "0 auto", maxWidth: "340px" }}>
              "{GUIDE.intro}"
            </p>
            <div style={{ marginTop: "12px", display: "flex", gap: "16px", justifyContent: "center" }}>
              <span style={{ fontFamily: serif, fontSize: "11px", color: color.inkFaint }}>{GUIDE.placeCount} places</span>
              <span style={{ color: color.border }}>·</span>
              <span style={{ fontFamily: serif, fontSize: "11px", color: color.inkFaint }}>{GUIDE.context}</span>
            </div>
          </div>

          {/* Category filters */}
          <div style={{ padding: "0 24px", marginBottom: "4px" }}>
            <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid " + color.borderSoft, paddingBottom: "10px" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  style={{
                    background: "none", border: "none", padding: "3px 0", cursor: "pointer",
                    fontFamily: serif, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: activeCat === cat ? color.ink : "#C0B8B0",
                    borderBottom: activeCat === cat ? "1.5px solid " + color.ink : "1.5px solid transparent",
                    paddingBottom: "8px",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Places list */}
          {filtered.map((place, i) => (
            <div key={place.id}>
              <div
                onClick={() => setExpanded(expanded === place.id ? null : place.id)}
                style={{
                  padding: "16px 24px", borderBottom: "1px solid " + color.border,
                  cursor: "pointer", display: "flex", gap: "14px", alignItems: "flex-start",
                  backgroundColor: expanded === place.id ? "#FDFBF8" : "transparent",
                  transition: "background-color 0.2s ease",
                }}
              >
                <span style={{ fontFamily: serif, fontSize: "13px", color: color.inkFaint, width: "18px", flexShrink: 0, paddingTop: "2px" }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <span style={{ fontFamily: serif, fontSize: "11px", color: color.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{place.category}</span>
                    {place.timeSensitive && (
                      <span style={{ fontFamily: serif, fontSize: "10px", color: "#9B8B5A" }}>⏱ {place.timeSensitive}</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: "16px", fontWeight: "400", color: color.ink, margin: "0 0 2px" }}>{place.name}</h3>
                  <p style={{ fontFamily: serif, fontSize: "12px", color: color.inkFaint, fontStyle: "italic", margin: 0 }}>{place.neighborhood}</p>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C0B8B0" strokeWidth="1.5" style={{
                  marginTop: "6px",
                  transform: expanded === place.id ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s",
                }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {expanded === place.id && (
                <div style={{ padding: "16px 24px 20px", borderBottom: "1px solid " + color.border, backgroundColor: "#FDFBF8" }}>
                  <PhotoBlock photoColor={place.photoColor} photo={place.photo} height={120} />
                  <p style={{ fontFamily: serif, fontSize: "14px", lineHeight: 1.85, color: color.inkMuted, margin: "12px 0 10px" }}>{place.note}</p>
                  <p style={{ fontFamily: serif, fontSize: "12px", color: color.inkFaint, fontStyle: "italic", margin: "0 0 14px" }}>{place.vibe}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "none", border: "1px solid " + color.borderBold, borderRadius: "2px", padding: "8px 14px", fontFamily: serif, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.ink, cursor: "pointer" }}>
                      Get directions
                    </button>
                    <button style={{ background: "none", border: "1px solid " + color.borderBold, borderRadius: "2px", padding: "8px 14px", fontFamily: serif, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.inkFaint, cursor: "pointer" }}>
                      Share place
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ height: "48px" }} />
        </div>

        {/* ── Right Panel: Persistent Map ── */}
        <div style={{ flex: 1, position: "relative" }}>
          <MapPlaceholder height="100%" style={{ height: "100%" }} />
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 2: Guide Artifact View — Desktop (wider card layout)
// ═══════════════════════════════════════════════════════════════════════════
function DesktopGuideViewScreen() {
  return (
    <div style={{ backgroundColor: color.canvas, minHeight: "100%", fontFamily: serif }}>
      {/* Nav */}
      <div style={{
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid " + color.border,
        position: "sticky", top: 0, backgroundColor: color.canvas, zIndex: 20,
      }}>
        <Logo size={14} />
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={{ background: "none", border: "1px solid " + color.border, borderRadius: "2px", padding: "8px 14px", fontFamily: serif, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.ink, cursor: "pointer" }}>
            Share
          </button>
          <button style={{
            background: color.accent, border: "none", borderRadius: "2px",
            padding: "9px 18px", fontFamily: serif, fontSize: "11px",
            letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", cursor: "pointer",
          }}>
            I'm here
          </button>
        </div>
      </div>

      {/* Content — centered max-width column */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "48px 0 24px" }}>
          <p style={{ fontFamily: serif, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: color.accent, margin: "0 0 12px" }}>A guide by {GUIDE.author}</p>
          <h1 style={{ fontFamily: serif, fontSize: "32px", fontWeight: "400", color: color.ink, margin: "0 0 4px", lineHeight: 1.2 }}>
            {GUIDE.city}
          </h1>
          <p style={{ fontFamily: serif, fontSize: "15px", color: color.inkFaint, margin: "0 0 6px" }}>{GUIDE.country}</p>
          <Divider />
          <p style={{ fontFamily: serif, fontSize: "16px", fontStyle: "italic", color: color.inkMuted, lineHeight: 1.8, margin: "0 auto", maxWidth: "520px" }}>
            "{GUIDE.intro}"
          </p>
        </div>

        {/* Inline map at top */}
        <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid " + color.borderBold, marginBottom: "32px" }}>
          <MapPlaceholder height={280} />
        </div>

        {/* 2-column place cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "48px" }}>
          {GUIDE.places.map((place, i) => (
            <div key={place.id} style={{
              border: "1px solid " + color.border,
              borderRadius: "3px",
              overflow: "hidden",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "box-shadow 0.2s ease",
            }}>
              <PhotoBlock photoColor={place.photoColor} photo={place.photo} height={100} />
              <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontFamily: serif, fontSize: "10px", color: color.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{place.category}</span>
                  {place.timeSensitive && (
                    <span style={{ fontFamily: serif, fontSize: "9px", color: "#9B8B5A" }}>⏱ {place.timeSensitive}</span>
                  )}
                </div>
                <h3 style={{ fontFamily: serif, fontSize: "15px", fontWeight: "400", color: color.ink, margin: "0 0 3px" }}>{place.name}</h3>
                <p style={{ fontFamily: serif, fontSize: "11px", color: color.inkFaint, fontStyle: "italic", margin: "0 0 8px" }}>{place.neighborhood}</p>
                <p style={{ fontFamily: serif, fontSize: "12px", color: color.inkMuted, lineHeight: 1.7, margin: 0,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{place.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// SCREEN 3: Place Detail — Desktop (centered reading-width)
// ═══════════════════════════════════════════════════════════════════════════
function DesktopPlaceDetailScreen() {
  const place = GUIDE.places[2]; // Bodega Casa Montaña
  return (
    <div style={{ backgroundColor: color.canvas, minHeight: "100%", fontFamily: serif }}>
      {/* Nav */}
      <div style={{
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid " + color.border,
        position: "sticky", top: 0, backgroundColor: color.canvas, zIndex: 20,
      }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: 0, color: color.inkFaint, fontFamily: serif, fontSize: "13px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6" /></svg>
          Back to guide
        </button>
        <Logo size={14} />
        <div style={{ width: 100 }} />
      </div>

      {/* Two-column: Content left, Map right */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 32px", display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {/* Left: Place content */}
        <div style={{ flex: 1, maxWidth: "520px" }}>
          <div style={{ marginBottom: "4px" }}>
            <span style={{ fontFamily: serif, fontSize: "11px", color: color.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{place.category}</span>
            {place.timeSensitive && (
              <span style={{ fontFamily: serif, fontSize: "11px", color: "#9B8B5A", marginLeft: "12px" }}>⏱ {place.timeSensitive}</span>
            )}
          </div>
          <h1 style={{ fontFamily: serif, fontSize: "28px", fontWeight: "400", color: color.ink, margin: "0 0 4px" }}>{place.name}</h1>
          <p style={{ fontFamily: serif, fontSize: "13px", color: color.inkFaint, fontStyle: "italic", margin: "0 0 20px" }}>{place.neighborhood}</p>

          <PhotoBlock photoColor={place.photoColor} photo={place.photo} height={200} />

          <p style={{ fontFamily: serif, fontSize: "16px", lineHeight: 1.9, color: color.inkMuted, margin: "20px 0" }}>{place.note}</p>
          <p style={{ fontFamily: serif, fontSize: "13px", color: color.inkFaint, fontStyle: "italic", margin: "0 0 24px" }}>{place.vibe}</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: color.accent, border: "none", borderRadius: "2px", padding: "10px 20px", fontFamily: serif, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", cursor: "pointer" }}>
              Get directions
            </button>
            <button style={{ background: "none", border: "1px solid " + color.borderBold, borderRadius: "2px", padding: "10px 20px", fontFamily: serif, fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", color: color.ink, cursor: "pointer" }}>
              Share this place
            </button>
          </div>
        </div>

        {/* Right: Sticky mini-map */}
        <div style={{ width: "320px", flexShrink: 0, position: "sticky", top: "70px" }}>
          <div style={{ borderRadius: "4px", overflow: "hidden", border: "1px solid " + color.borderBold }}>
            <MapPlaceholder height={240} />
          </div>
          <p style={{ fontFamily: serif, fontSize: "11px", color: color.inkFaint, textAlign: "center", margin: "10px 0 0", fontStyle: "italic" }}>
            3 of 7 in Justin's Valencia
          </p>
          {/* Quick nav to other places */}
          <div style={{ marginTop: "16px", padding: "12px", border: "1px solid " + color.borderSoft, borderRadius: "3px", backgroundColor: color.surface }}>
            <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: color.inkFaint, margin: "0 0 8px" }}>Also in this guide</p>
            {GUIDE.places.filter(p => p.id !== place.id).slice(0, 3).map(p => (
              <div key={p.id} style={{ padding: "6px 0", borderBottom: "1px solid " + color.borderSoft, cursor: "pointer" }}>
                <p style={{ fontFamily: serif, fontSize: "13px", color: color.ink, margin: "0 0 1px" }}>{p.name}</p>
                <p style={{ fontFamily: serif, fontSize: "10px", color: color.inkFaint, fontStyle: "italic", margin: 0 }}>{p.neighborhood}</p>
              </div>
            ))}
            <p style={{ fontFamily: serif, fontSize: "11px", color: color.accent, margin: "8px 0 0", cursor: "pointer" }}>View all {GUIDE.placeCount} places →</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT RULES PANEL
// ═══════════════════════════════════════════════════════════════════════════
function LayoutRulesPanel() {
  return (
    <div style={{ padding: "32px", fontFamily: sans, maxWidth: "720px", margin: "0 auto" }}>
      <h2 style={{ fontFamily: serif, fontSize: "22px", fontWeight: 400, color: color.ink, margin: "0 0 6px" }}>Responsive Layout Rules</h2>
      <p style={{ fontSize: "13px", color: color.inkMuted, lineHeight: 1.7, margin: "0 0 28px" }}>
        Reference for Claude Code when implementing the Next.js recipient experience. These rules define how the layout adapts across breakpoints.
      </p>

      {/* Breakpoints */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontFamily: serif, fontSize: "14px", fontWeight: 400, color: color.accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Breakpoints</h3>
        <div style={{ border: "1px solid " + color.border, borderRadius: "3px", overflow: "hidden" }}>
          {[
            { bp: "Mobile", range: "< 640px", layout: "Single column, stacked map → list. Map height: 200px fixed." },
            { bp: "Tablet", range: "640–1024px", layout: "Single column, wider content area (max-width: 720px centered). Map can be taller (280px). 2-column card grid in artifact view." },
            { bp: "Desktop", range: "> 1024px", layout: "Split panel: fixed 420px list panel (left) + persistent map (right, flex: 1). Map is always visible while scrolling places." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: i < 2 ? "1px solid " + color.borderSoft : "none", display: "flex", gap: "16px", alignItems: "baseline" }}>
              <div style={{ width: "80px", flexShrink: 0 }}>
                <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 600, color: color.ink }}>{item.bp}</span>
                <br />
                <span style={{ fontFamily: "monospace", fontSize: "10px", color: color.inkFaint }}>{item.range}</span>
              </div>
              <p style={{ fontSize: "12px", color: color.inkMuted, lineHeight: 1.6, margin: 0 }}>{item.layout}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Layout Patterns */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontFamily: serif, fontSize: "14px", fontWeight: 400, color: color.accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Key Patterns</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { title: "Recipient Landing (shared link)", desc: "Mobile: map stacked above list, full-width. Desktop: side-by-side split with list panel (scrollable) and persistent map. The map is the hero — it's what orients the recipient." },
            { title: "Guide Artifact View", desc: "Mobile: single-column card list. Tablet/Desktop: 2-column card grid (max-width: 720px centered). Map is inline at top, not persistent." },
            { title: "Place Detail / Deep Link", desc: "Mobile: stacked (photo → content → map at bottom). Desktop: 2-column with content (left, max 520px) and sticky map + guide context (right, 320px)." },
            { title: "Tour Guide Mode", desc: "Always full-screen map regardless of breakpoint. Bottom drawer pattern stays consistent. This is mobile-optimized by nature (you're walking around)." },
            { title: "Nav bar", desc: "Consistent across breakpoints. Logo left, actions right. Desktop adds subtle guide metadata (place count, year) inline. Same height, same border-bottom." },
            { title: "Content max-width", desc: "Reading content (intro text, notes) never exceeds 520px line-length for readability. The outer container can be wider but text blocks stay narrow." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "14px 16px", border: "1px solid " + color.borderSoft, borderRadius: "3px", backgroundColor: color.surface }}>
              <p style={{ fontFamily: serif, fontSize: "13px", color: color.ink, margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", color: color.inkMuted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Design Constants */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ fontFamily: serif, fontSize: "14px", fontWeight: 400, color: color.accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Design Constants</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { label: "List panel width", value: "420px (min 380, max 480)" },
            { label: "Content max-width", value: "720px (artifact view)" },
            { label: "Reading line-length", value: "520px max" },
            { label: "Card grid gap", value: "20px" },
            { label: "Desktop nav padding", value: "14px 32px" },
            { label: "Mobile nav padding", value: "16px 20px" },
            { label: "Map min-height (mobile)", value: "200px" },
            { label: "Map min-height (desktop inline)", value: "280px" },
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px 12px", border: "1px solid " + color.borderSoft, borderRadius: "2px" }}>
              <p style={{ fontFamily: "monospace", fontSize: "10px", color: color.inkFaint, margin: "0 0 2px" }}>{item.label}</p>
              <p style={{ fontFamily: "monospace", fontSize: "12px", color: color.ink, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What NOT to do */}
      <div>
        <h3 style={{ fontFamily: serif, fontSize: "14px", fontWeight: 400, color: "#B05050", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Avoid</h3>
        <div style={{ padding: "16px", border: "1px solid #E8C8C8", borderRadius: "3px", backgroundColor: "#FDF8F8" }}>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: color.inkMuted, lineHeight: 1.8 }}>
            <li>Hiding the map on desktop — it's always visible in the split layout</li>
            <li>Full-width text blocks — reading content stays ≤520px</li>
            <li>Hamburger menus — nav is simple enough to show inline at all sizes</li>
            <li>Sticky footers or bottom CTAs on desktop — the "I'm here" button lives in the nav</li>
            <li>Card grids beyond 2 columns — cards get too narrow and notes become unreadable</li>
            <li>Map below the fold on mobile — it should be the first visual element</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// ROOT: Tab Navigation
// ═══════════════════════════════════════════════════════════════════════════
export default function ResponsiveGuide() {
  const [activeTab, setActiveTab] = useState("landing");

  const tabs = [
    { key: "landing", label: "Recipient Landing" },
    { key: "artifact", label: "Guide Artifact" },
    { key: "detail", label: "Place Detail" },
    { key: "rules", label: "Layout Rules" },
  ];

  return (
    <div style={{ backgroundColor: "#E8E2DA", minHeight: "100vh", fontFamily: serif }}>
      {/* Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <p style={{ fontFamily: sans, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: color.accent, margin: 0, fontWeight: 600 }}>
            Lore Guides · Responsive Layout Guide
          </p>
          <p style={{ fontFamily: sans, fontSize: "9px", color: color.inkFaint, margin: 0 }}>
            Desktop Breakpoint (≥1024px)
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "3px", marginBottom: "16px", padding: "12px 0" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: "0 0 auto",
                padding: "8px 14px",
                backgroundColor: activeTab === tab.key ? color.ink : "transparent",
                color: activeTab === tab.key ? "#fff" : color.inkFaint,
                border: activeTab === tab.key ? "none" : "1px solid " + color.border,
                borderRadius: "2px",
                fontFamily: sans,
                fontSize: "10px",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: "16px", padding: "12px 16px", backgroundColor: color.surface, borderRadius: "3px", border: "1px solid " + color.borderSoft }}>
          <p style={{ fontFamily: serif, fontSize: "12px", color: color.inkMuted, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
            {activeTab === "landing" && "The recipient landing page at desktop width. Side-by-side split: scrollable place list (left panel, 420px) + persistent map (right, fills remaining space). The map stays visible while the user browses places."}
            {activeTab === "artifact" && "The guide artifact view at desktop width. Centered content column (max 720px) with inline map at top and 2-column place card grid. This is the 'browse before you go' view."}
            {activeTab === "detail" && "Individual place detail at desktop width. Two-column layout: place content (left, max 520px for reading comfort) + sticky map and guide context sidebar (right, 320px)."}
            {activeTab === "rules" && "Written layout rules and breakpoint definitions for Claude Code to reference during implementation. These complement the visual mockups."}
          </p>
        </div>
      </div>

      {/* Screen */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 48px" }}>
        <div style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid " + color.borderBold,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          backgroundColor: color.canvas,
          minHeight: activeTab === "rules" ? "auto" : "680px",
        }}>
          {activeTab === "landing" && <DesktopLandingScreen />}
          {activeTab === "artifact" && <DesktopGuideViewScreen />}
          {activeTab === "detail" && <DesktopPlaceDetailScreen />}
          {activeTab === "rules" && <LayoutRulesPanel />}
        </div>
      </div>
    </div>
  );
}
