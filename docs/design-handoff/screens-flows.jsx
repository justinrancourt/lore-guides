// Additional flows — Onboarding (1), Home (2), Add Place (3), Guide Creation (4),
// Import (5), Editing (9). Refreshed to the new system: dual taxonomy, Waymark,
// new copy, clock/pill flags. Hero illustrations kept simple — the originals
// had much more ornate work; these are lightweight stand-ins that read right
// in context and can be upgraded later.

// ─── Small illos ──────────────────────────────────────────────────────────
function IlloCompass({ size = 120 }) {
  const k = C.ink;
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <circle cx="90" cy="90" r="68" stroke={k} strokeWidth="0.75" opacity="0.7"/>
      <circle cx="90" cy="90" r="64" stroke={k} strokeWidth="0.4" opacity="0.35"/>
      <line x1="90" y1="22" x2="90" y2="30" stroke={k} strokeWidth="0.75" opacity="0.7"/>
      <line x1="90" y1="150" x2="90" y2="158" stroke={k} strokeWidth="0.75" opacity="0.7"/>
      <line x1="22" y1="90" x2="30" y2="90" stroke={k} strokeWidth="0.75" opacity="0.7"/>
      <line x1="150" y1="90" x2="158" y2="90" stroke={k} strokeWidth="0.75" opacity="0.7"/>
      <polygon points="90,50 85,90 90,82 95,90" fill={C.accent} opacity="0.8"/>
      <polygon points="90,130 85,90 90,98 95,90" stroke={k} strokeWidth="0.5" fill="none" opacity="0.4"/>
      <circle cx="90" cy="90" r="3" stroke={k} strokeWidth="0.75" fill="none" opacity="0.6"/>
      <text x="90" y="44" textAnchor="middle" fontFamily={serif} fontSize="9" fill={k} opacity="0.6">N</text>
    </svg>
  );
}
function IlloMap({ size = 130 }) {
  const k = C.ink;
  return (
    <svg width={size} height={size} viewBox="0 0 160 130" fill="none">
      <path d="M20 20 L60 15 L100 20 L140 15 L140 110 L100 115 L60 110 L20 115 Z" stroke={k} strokeWidth="0.75" fill="none" opacity="0.7"/>
      <line x1="60" y1="15" x2="60" y2="110" stroke={k} strokeWidth="0.5" opacity="0.4"/>
      <line x1="100" y1="20" x2="100" y2="115" stroke={k} strokeWidth="0.5" opacity="0.4"/>
      <path d="M30 50 Q50 45 70 55 Q90 65 120 50" stroke={k} strokeWidth="0.4" opacity="0.3"/>
      <path d="M40 80 Q70 70 100 85 Q120 95 130 80" stroke={k} strokeWidth="0.4" opacity="0.3"/>
      <Waymark size={16} color={C.accent}/>
      <g transform="translate(76, 52)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={C.accent} stroke={C.accentDeep} strokeWidth="0.5"/></g>
      <g transform="translate(100, 80)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={C.sage} opacity="0.6"/></g>
    </svg>
  );
}
function IlloEnvelope({ size = 130 }) {
  const k = C.ink;
  return (
    <svg width={size} height={size*0.7} viewBox="0 0 140 100" fill="none">
      <rect x="15" y="20" width="110" height="65" rx="2" stroke={k} strokeWidth="0.75" opacity="0.8"/>
      <path d="M15 20 L70 58 L125 20" stroke={k} strokeWidth="0.75" fill="none" opacity="0.8"/>
      <circle cx="70" cy="45" r="8" stroke={C.accent} strokeWidth="0.6" opacity="0.6"/>
      <polygon points="70,39 71.5,43 76,43.5 72.5,46.5 73.5,51 70,48.5 66.5,51 67.5,46.5 64,43.5 68.5,43" fill={C.accent} opacity="0.6"/>
    </svg>
  );
}

// ─── FLOW 1 — ONBOARDING ─────────────────────────────────────────────────────
function Screen_Onb_Welcome() {
  return (
    <Phone height={812} label="1.1 Welcome">
      <div style={{ padding: "80px 32px 0", textAlign: "center" }}>
        <IlloCompass size={120}/>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, margin: "38px 0 14px" }}>Lore Guides</p>
        <h1 style={{ fontFamily: serif, fontSize: 36, color: C.ink, margin: "0 0 14px", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Where have you loved?</h1>
        <p style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.7, color: C.inkMuted, fontStyle: "italic", margin: "0 auto 0", maxWidth: 300 }}>
          A quiet place to write the guides you'd give your closest friends. One city at a time.
        </p>
      </div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 40 }}>
        <button style={{ width: "100%", padding: "14px", background: C.ink, border: "none", borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg, marginBottom: 10 }}>Begin</button>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", textAlign: "center", margin: 0 }}>Already have an account? <span style={{ color: C.accent, fontStyle: "normal" }}>Sign in</span></p>
      </div>
    </Phone>
  );
}
function Screen_Onb_Invite() {
  return (
    <Phone height={812} label="1.2 Invite-only">
      <NavBar left={<BackBtn label="Back"/>} center={<Logo size={11}/>} />
      <div style={{ padding: "48px 28px 0", textAlign: "center" }}>
        <IlloEnvelope size={120}/>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "32px 0 14px" }}>By invitation</p>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: C.ink, margin: "0 0 14px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.15 }}>Lore is invite-only for now</h2>
        <p style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.7, color: C.inkMuted, fontStyle: "italic", margin: "0 0 30px" }}>
          We're keeping it small while we figure it out. Have a code from a friend?
        </p>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 14 }}>
          <p style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, margin: "0 0 6px" }}>Invite code</p>
          <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, color: C.ink, letterSpacing: "0.18em" }}>LORE-______</div>
        </div>
        <button style={{ width: "100%", padding: "12px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg }}>Redeem code</button>
      </div>
      <p style={{ position: "absolute", left: 28, right: 28, bottom: 40, fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", textAlign: "center", margin: 0 }}>
        No code? <span style={{ color: C.accent, fontStyle: "normal" }}>Join the waitlist</span>
      </p>
    </Phone>
  );
}
function Screen_Onb_Name() {
  return (
    <Phone height={812} label="1.3 Your name">
      <NavBar left={<BackBtn label="Back"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Step 1 of 3</span>}/>
      <div style={{ padding: "56px 28px 0" }}>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "0 0 14px" }}>Tell us about you</p>
        <h2 style={{ fontFamily: serif, fontSize: 30, color: C.ink, margin: "0 0 10px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.12 }}>What should we call you?</h2>
        <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 32px", lineHeight: 1.6 }}>Your name appears on every guide you share.</p>
        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Name</label>
        <input defaultValue="Justin" style={{ width: "100%", padding: "12px 0", background: "none", border: "none", borderBottom: `1px solid ${C.ink}`, fontFamily: serif, fontSize: 22, color: C.ink, outline: "none", boxSizing: "border-box" }}/>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "10px 0 0" }}>First name is fine. You can change this later.</p>
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 40 }}>
        <button style={{ width: "100%", padding: "13px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg }}>Continue</button>
      </div>
    </Phone>
  );
}
function Screen_Onb_FirstCity() {
  return (
    <Phone height={812} label="1.4 First city">
      <NavBar left={<BackBtn label="Back"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Step 3 of 3</span>}/>
      <div style={{ padding: "48px 28px 0", textAlign: "center" }}>
        <IlloMap size={120}/>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "28px 0 12px" }}>Your first guide</p>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: C.ink, margin: "0 0 12px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.15 }}>Where should we begin?</h2>
        <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 28px", lineHeight: 1.6 }}>A city you know well. Not the place you're planning — the place you already love.</p>
        <div style={{ background: C.surface, border: `1px solid ${C.borderBold}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
          <Icon path={Paths.mapPin} size={14} color={C.faint}/>
          <input placeholder="Search a city…" style={{ flex: 1, background: "none", border: "none", fontFamily: serif, fontSize: 15, color: C.ink, outline: "none" }}/>
        </div>
        <div style={{ marginTop: 10 }}>
          {[{n:"Valencia",c:"Spain"},{n:"Lisbon",c:"Portugal"},{n:"Mexico City",c:"Mexico"}].map(x => (
            <div key={x.n} style={{ padding: "12px 2px", display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, textAlign: "left" }}>
              <span style={{ fontFamily: serif, fontSize: 15, color: C.ink }}>{x.n}</span>
              <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic" }}>{x.c}</span>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─── FLOW 2 — HOME ────────────────────────────────────────────────────────────
function GuideCard({ g }) {
  return (
    <div style={{ marginBottom: 18, cursor: "pointer" }}>
      <div style={{ width: "100%", aspectRatio: "16/9", background: g.color, position: "relative", overflow: "hidden", marginBottom: 10 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent 50%, rgba(0,0,0,0.2))" }}/>
        <div style={{ position: "absolute", left: 14, bottom: 12, color: "#fff" }}>
          <p style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, opacity: 0.85 }}>{g.year}</p>
          <h3 style={{ fontFamily: serif, fontSize: 24, margin: "2px 0 0", fontWeight: 400, letterSpacing: "-0.01em" }}>{g.city}</h3>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic" }}>{g.country}</span>
        <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{g.count} places</span>
      </div>
    </div>
  );
}
function Screen_Home() {
  const mine = [
    { city: "Valencia", country: "Spain", count: 7, color: "#C17C4E", year: "2019" },
    { city: "Lisbon", country: "Portugal", count: 11, color: "#7A8B5E", year: "2022" },
    { city: "New York", country: "USA", count: 14, color: "#4A6B8B", year: "Ongoing" },
  ];
  const shared = [
    { city: "Tokyo", country: "Japan", count: 9, color: "#8B4E6B", year: "2024", author: "Sarah" },
    { city: "Barcelona", country: "Spain", count: 6, color: "#6B7A4E", year: "2023", author: "Marco" },
  ];
  return (
    <Phone height={812} label="2.1 Home · My guides">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "20px 20px 32px" }}>
        <div style={{ display: "flex", gap: 18, marginBottom: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>My guides</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Shared with me</span>
        </div>
        {mine.map(g => <GuideCard key={g.city} g={g}/>)}
        <button style={{ width: "100%", marginTop: 16, padding: "14px", background: "none", border: `1px dashed ${C.borderBold}`, cursor: "pointer", fontFamily: serif, fontSize: 13, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon path={Paths.plus} size={12} color={C.inkMuted}/> Start a new city
        </button>
      </div>
    </Phone>
  );
}

// ─── FLOW 4 — GUIDE CREATION ─────────────────────────────────────────────────
function Screen_NewGuide() {
  return (
    <Phone height={812} label="4.1 New guide · intro">
      <NavBar left={<div style={{ display: "flex", alignItems: "center", gap: 3, color: C.faint }}><Icon path={Paths.x} size={14} color={C.faint}/><span style={{ fontFamily: serif, fontSize: 13 }}>Cancel</span></div>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Valencia · New guide</span>}/>
      <div style={{ padding: "28px 24px 0" }}>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "0 0 12px" }}>A guide to</p>
        <h2 style={{ fontFamily: serif, fontSize: 44, color: C.ink, margin: "0 0 4px", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05 }}>Valencia</h2>
        <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 32px" }}>Spain</p>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Your relationship to this city</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Lived there","Visited often","Visited once","Going soon"].map((x,i) => (
              <span key={x} style={{ fontFamily: serif, fontSize: 12, padding: "5px 11px", border: `1px solid ${i===0 ? C.ink : C.border}`, color: i===0 ? C.ink : C.faint, background: i===0 ? C.surface : "transparent", borderRadius: 999 }}>{x}</span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>When</label>
          <input defaultValue="2019" style={{ width: "100%", padding: "6px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 16, color: C.ink, outline: "none" }}/>
        </div>
        <div>
          <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>A few words of intro</label>
          <textarea placeholder="Why this city matters to you…" style={{ width: "100%", minHeight: 100, padding: "8px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 15, lineHeight: 1.6, color: C.ink, outline: "none", resize: "none", fontStyle: "italic", boxSizing: "border-box" }}/>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 22px", background: `linear-gradient(to top, ${C.bg}, rgba(250,248,245,0))` }}>
        <button style={{ width: "100%", padding: "13px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg }}>Start adding places</button>
      </div>
    </Phone>
  );
}

// ─── FLOW 3 — ADD PLACE ──────────────────────────────────────────────────────
function Screen_AddPlace_Search() {
  const res = [
    { n: "Ricard Camarena Restaurant", nb: "Benicalap", t: "Restaurant · Michelin" },
    { n: "Bar Ricardo", nb: "El Carmen", t: "Bar · Tapas" },
    { n: "La Pepica", nb: "Malvarrosa", t: "Restaurant · Paella" },
    { n: "Riff Restaurant", nb: "Eixample", t: "Restaurant · Fine dining" },
  ];
  return (
    <Phone height={812} label="3.1 Add place · search">
      <NavBar left={<div style={{ display: "flex", alignItems: "center", gap: 4, color: C.faint }}><Icon path={Paths.x} size={14} color={C.faint}/><span style={{ fontFamily: serif, fontSize: 13 }}>Cancel</span></div>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Add to Valencia</span>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.borderBold}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} size={14} color={C.faint}/>
          <input defaultValue="bar ric" style={{ flex: 1, background: "none", border: "none", fontFamily: serif, fontSize: 15, color: C.ink, outline: "none" }}/>
        </div>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, margin: "20px 0 4px" }}>Results</p>
      </div>
      <div>
        {res.map((r, i) => (
          <div key={r.n} style={{ padding: "14px 20px", borderTop: i===0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
            <Icon path={Paths.mapPin} size={14} color={C.faint}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{r.n}</div>
              <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", marginTop: 2 }}>{r.nb} · {r.t}</div>
            </div>
            <Icon path={Paths.plus} size={14} color={C.accent}/>
          </div>
        ))}
      </div>
      <div style={{ padding: "22px 20px 0", textAlign: "center" }}>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: 0 }}>Not finding it? <span style={{ color: C.accent, fontStyle: "normal" }}>Add manually</span></p>
      </div>
    </Phone>
  );
}
function Screen_AddPlace_Note() {
  return (
    <Phone height={812} label="3.2 Add place · note + category">
      <NavBar left={<BackBtn label="Search"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Step 2 of 2</span>} right={<span style={{ fontFamily: serif, fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Save</span>}/>
      <div style={{ padding: "24px 22px 0" }}>
        <h3 style={{ fontFamily: serif, fontSize: 26, color: C.ink, margin: "0 0 2px", fontWeight: 400, letterSpacing: "-0.015em" }}>Bar Ricardo</h3>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 24px" }}>El Carmen · Bar · Tapas</p>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Best time</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
          {["Morning","Afternoon","Evening","Night","Day Trip"].map((t,i) => (
            <span key={t} style={{ fontFamily: serif, fontSize: 12, padding: "5px 11px", border: `1px solid ${i===2 ? C.ink : C.border}`, color: i===2 ? C.ink : C.faint, background: i===2 ? C.surface : "transparent", borderRadius: 999 }}>{t}</span>
          ))}
        </div>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Type</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["Eat","Drink","See","Do"].map((t,i) => (
            <span key={t} style={{ fontFamily: serif, fontSize: 12, padding: "5px 11px", border: `1px solid ${i===1 ? C.ink : C.border}`, color: i===1 ? C.ink : C.faint, background: i===1 ? C.surface : "transparent", borderRadius: 999 }}>{t}</span>
          ))}
        </div>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Your note</label>
        <textarea placeholder="Why should a friend come here?" defaultValue="Hidden gem. Go for the jamón croquetas. Order a vermut while you wait."
          style={{ width: "100%", minHeight: 110, padding: 12, background: C.surface, border: `1px solid ${C.borderBold}`, borderRadius: 2, fontFamily: serif, fontSize: 15, lineHeight: 1.7, color: C.ink, outline: "none", resize: "none", boxSizing: "border-box" }}/>

        <div style={{ marginTop: 20, padding: "14px 0", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: 14, color: C.ink, margin: 0 }}>Time-sensitive</p>
            <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "2px 0 0" }}>e.g. "Best after 10pm"</p>
          </div>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: C.borderBold, position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: 3, width: 16, height: 16, borderRadius: 8, background: "#fff" }}/>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── FLOW 5 — IMPORT ─────────────────────────────────────────────────────────
function FlowDots({ current, steps }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 22, padding: "10px 0 14px", borderBottom: `1px solid ${C.border}` }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: i <= current ? C.accent : C.border, opacity: i < current ? 0.45 : 1 }}/>
          <span style={{ fontFamily: sans, fontSize: 9, color: i === current ? C.accent : C.faint, letterSpacing: "0.06em" }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
function Screen_Import_Paste() {
  return (
    <Phone height={812} label="5.1 Import · paste">
      <NavBar left={<BackBtn label="Valencia"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Import</span>}/>
      <FlowDots current={0} steps={["Paste","Review","Annotate","Done"]}/>
      <div style={{ padding: "28px 24px 0" }}>
        <h3 style={{ fontFamily: serif, fontSize: 24, color: C.ink, margin: "0 0 8px", fontWeight: 400, letterSpacing: "-0.01em" }}>Paste a Google Maps list</h3>
        <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 24px", lineHeight: 1.6 }}>We'll pull in the places you've saved. You'll write the notes — that's the whole point.</p>
        <div style={{ background: C.surface, border: `1px dashed ${C.borderBold}`, padding: "22px 16px", textAlign: "center" }}>
          <Icon path={Paths.external} size={18} color={C.faint}/>
          <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "10px 0 14px", lineHeight: 1.6 }}>Open your list in Google Maps → Share → Copy link</p>
          <input placeholder="Paste link here" style={{ width: "100%", padding: "10px 12px", background: C.bg, border: `1px solid ${C.border}`, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: C.ink, outline: "none", boxSizing: "border-box" }}/>
        </div>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "16px 0 0", textAlign: "center" }}>Don't have one? <span style={{ color: C.accent, fontStyle: "normal" }}>Add places one by one</span></p>
      </div>
    </Phone>
  );
}
function Screen_Import_Review() {
  const places = [
    { n: "Ricard Camarena Restaurant", nb: "Benicalap", t: "Restaurant", on: true },
    { n: "Bar Ricardo", nb: "El Carmen", t: "Bar · Tapas", on: true },
    { n: "La Pepica", nb: "Malvarrosa", t: "Restaurant · Paella", on: true },
    { n: "Agua de Mayo", nb: "Ruzafa", t: "Bar", on: true },
    { n: "Mercado de Ruzafa", nb: "Ruzafa", t: "Market", on: false },
    { n: "Café de las Horas", nb: "El Carmen", t: "Bar", on: true },
  ];
  return (
    <Phone height={812} label="5.2 Import · review">
      <NavBar left={<BackBtn label="Back"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Import</span>} right={<span style={{ fontFamily: serif, fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Next</span>}/>
      <FlowDots current={1} steps={["Paste","Review","Annotate","Done"]}/>
      <div style={{ padding: "20px 20px 0" }}>
        <h3 style={{ fontFamily: serif, fontSize: 20, color: C.ink, margin: "0 0 4px", fontWeight: 400 }}>Found {places.length} places</h3>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 6px" }}>Untick any you don't want. You'll write notes next.</p>
      </div>
      <div>
        {places.map((p, i) => (
          <div key={p.n} style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, opacity: p.on ? 1 : 0.45 }}>
            <div style={{ width: 18, height: 18, border: `1.5px solid ${p.on ? C.accent : C.borderBold}`, borderRadius: 2, background: p.on ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {p.on && <Icon path={Paths.check} size={11} color="#fff"/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{p.n}</div>
              <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", marginTop: 2 }}>{p.nb} · {p.t}</div>
            </div>
          </div>
        ))}
      </div>
    </Phone>
  );
}
function Screen_Import_Annotate() {
  return (
    <Phone height={812} label="5.3 Import · annotate">
      <NavBar left={<BackBtn label="Review"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>1 of 5 drafts</span>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <FlowDots current={2} steps={["Paste","Review","Annotate","Done"]}/>
      <div style={{ padding: "24px 22px 0" }}>
        <h3 style={{ fontFamily: serif, fontSize: 26, color: C.ink, margin: "0 0 2px", fontWeight: 400, letterSpacing: "-0.015em" }}>Bar Ricardo</h3>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 20px" }}>El Carmen · Bar · Tapas</p>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Best time · Type</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          <span style={{ fontFamily: serif, fontSize: 12, padding: "4px 10px", border: `1px solid ${C.ink}`, color: C.ink, background: C.surface, borderRadius: 999 }}>Evening</span>
          <span style={{ fontFamily: serif, fontSize: 12, padding: "4px 10px", border: `1px solid ${C.ink}`, color: C.ink, background: C.surface, borderRadius: 999 }}>Drink</span>
        </div>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Your note</label>
        <textarea placeholder="What makes it worth it?"
          style={{ width: "100%", minHeight: 150, padding: 12, background: C.surface, border: `1px solid ${C.borderBold}`, borderRadius: 2, fontFamily: serif, fontSize: 15, lineHeight: 1.7, color: C.ink, outline: "none", resize: "none", fontStyle: "italic", boxSizing: "border-box" }}/>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "12px 0 0" }}>Tip: specifics over adjectives. "The jamón croquetas at the bar" beats "amazing food."</p>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 20px 22px", background: C.bg, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
        <button style={{ flex: 1, padding: "11px", background: "none", border: `1px solid ${C.borderBold}`, cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMuted }}>Skip</button>
        <button style={{ flex: 2, padding: "11px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg }}>Save · Next</button>
      </div>
    </Phone>
  );
}

// ─── FLOW 9 — EDITING ────────────────────────────────────────────────────────
function Screen_Edit_Place() {
  const photos = [{ c: "#6B4E3D" }, { c: "#8B6F4E" }, { c: "#4A3728" }];
  return (
    <Phone height={812} label="9.1 Edit place · full">
      <NavBar left={<div style={{ display: "flex", alignItems: "center", gap: 3, color: C.faint }}><Icon path={Paths.x} size={14} color={C.faint}/><span style={{ fontFamily: serif, fontSize: 13 }}>Cancel</span></div>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Edit place</span>} right={<span style={{ fontFamily: serif, fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Save</span>}/>
      <div style={{ padding: "22px 22px 100px" }}>
        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Name</label>
        <input defaultValue="Bodega Casa Montaña" style={{ width: "100%", padding: "4px 0 8px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 22, color: C.ink, outline: "none", marginBottom: 18, boxSizing: "border-box" }}/>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Address</label>
        <input defaultValue="C/ de Josep Benlliure, 69 · El Cabanyal" style={{ width: "100%", padding: "4px 0 8px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 14, color: C.inkMuted, outline: "none", marginBottom: 22, boxSizing: "border-box" }}/>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 8 }}>Photos</label>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 18 }}>
          {photos.map((p, i) => (
            <div key={i} style={{ width: 92, height: 92, background: p.c, flexShrink: 0, position: "relative", filter: "saturate(0.8)" }}>
              {i === 0 && <div style={{ position: "absolute", left: 4, bottom: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontFamily: serif, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 5px" }}>Cover</div>}
              <div style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "#fff", width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon path={Paths.x} size={10} color="#fff"/>
              </div>
            </div>
          ))}
          <div style={{ width: 92, height: 92, border: `1px dashed ${C.borderBold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.faint }}>
            <Icon path={Paths.plus} size={16} color={C.faint}/>
          </div>
        </div>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Vibe — one line</label>
        <input defaultValue="The real thing" style={{ width: "100%", padding: "4px 0 8px", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 16, fontStyle: "italic", color: C.ink, outline: "none", marginBottom: 18, boxSizing: "border-box" }}/>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Your note</label>
        <textarea defaultValue="The oldest bar in Valencia, since 1836. The clóchinas are non-negotiable. So is the vermut on tap. Walk around El Cabanyal before dinner."
          style={{ width: "100%", minHeight: 120, padding: 12, background: C.surface, border: `1px solid ${C.borderBold}`, borderRadius: 2, fontFamily: serif, fontSize: 15, lineHeight: 1.7, color: C.ink, outline: "none", resize: "none", marginBottom: 18, boxSizing: "border-box" }}/>

        <div style={{ padding: "14px 0", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: serif, fontSize: 14, color: C.ink, margin: 0 }}>Time-sensitive</p>
            <p style={{ fontFamily: serif, fontSize: 12, color: C.time, fontStyle: "italic", margin: "2px 0 0" }}>Opens at 7pm</p>
          </div>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: C.accent, position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: 21, width: 16, height: 16, borderRadius: 8, background: "#fff" }}/>
          </div>
        </div>

        <button style={{ marginTop: 24, background: "none", border: "none", padding: 0, cursor: "pointer", color: "#B33", fontFamily: serif, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>Delete this place</button>
      </div>
    </Phone>
  );
}
function Screen_Edit_Reorder() {
  return (
    <Phone height={812} label="9.2 Reorder places">
      <NavBar left={<BackBtn label="Done"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Reorder · Valencia</span>}/>
      <div style={{ padding: "18px 20px 0" }}>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 14px" }}>Drag to reorder. Grouped by time of day.</p>
        {TIME_CATS.slice(1).map(cat => {
          const items = GUIDE.places.filter(p => p.time === cat);
          if (!items.length) return null;
          return (
            <div key={cat} style={{ marginBottom: 22 }}>
              <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent, margin: "0 0 8px" }}>{cat}</p>
              {items.map(p => (
                <div key={p.id} style={{ padding: "12px 12px", background: C.bg, border: `1px solid ${C.border}`, marginBottom: 6, display: "flex", alignItems: "center", gap: 10, cursor: "grab" }}>
                  <svg width="9" height="13" viewBox="0 0 9 13" fill={C.faint}><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: serif, fontSize: 14, color: C.ink }}>{p.name}</div>
                    <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", marginTop: 1 }}>{p.nbhd}</div>
                  </div>
                  <span style={{ fontFamily: serif, fontSize: 10, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.type}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </Phone>
  );
}

Object.assign(window, {
  Screen_Onb_Welcome, Screen_Onb_Invite, Screen_Onb_Name, Screen_Onb_FirstCity,
  Screen_Home, Screen_NewGuide,
  Screen_AddPlace_Search, Screen_AddPlace_Note,
  Screen_Import_Paste, Screen_Import_Review, Screen_Import_Annotate,
  Screen_Edit_Place, Screen_Edit_Reorder,
});
