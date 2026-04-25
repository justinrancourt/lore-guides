// Shared primitives: phone frame, nav bar, map, cover, photo, filter bar.
// Depends on tokens.jsx (window.C, serif, sans, Icon, Paths, Waymark, etc.)

// ─── iPhone-style frame (bigger, with status bar + home indicator) ───────
function Phone({ children, height = 812, width = 390, label, browserChrome, browserUrl }) {
  return (
    <div style={{ position: "relative", width, margin: "0 auto" }}>
      {/* frame */}
      <div style={{ position: "absolute", inset: -10, borderRadius: 46, background: "#1A1714", boxShadow: "inset 0 0 0 2px #2A2520, 0 24px 60px rgba(0,0,0,0.35)", zIndex: 0 }} />
      {/* notch */}
      <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 110, height: 26, background: "#1A1714", borderRadius: "0 0 16px 16px", zIndex: 10 }} />
      <div style={{ position: "relative", width, height, borderRadius: 38, overflow: "hidden", background: C.bg, zIndex: 1 }}>
        {/* status bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", zIndex: 30, pointerEvents: "none", fontFamily: sans, fontSize: 14, fontWeight: 600, color: C.ink }}>
          <span>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {/* signal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill={C.ink}><rect x="0" y="7" width="3" height="4" rx=".5"/><rect x="4.5" y="5" width="3" height="6" rx=".5"/><rect x="9" y="2.5" width="3" height="8.5" rx=".5"/><rect x="13.5" y="0" width="3" height="11" rx=".5"/></svg>
            {/* wifi */}
            <svg width="15" height="11" viewBox="0 0 16 11" fill={C.ink}><path d="M8 2.5a10.5 10.5 0 0 1 7 2.7l-.9 1A9 9 0 0 0 8 4c-2.3 0-4.5.9-6.1 2.2l-.9-1A10.5 10.5 0 0 1 8 2.5zm0 3a7.3 7.3 0 0 1 4.9 1.9l-1 1.1A5.8 5.8 0 0 0 8 7a5.8 5.8 0 0 0-3.9 1.5l-1-1.1A7.3 7.3 0 0 1 8 5.5zm0 3.1a4 4 0 0 1 2.7 1l-2.7 2.8L5.3 9.6a4 4 0 0 1 2.7-1z"/></svg>
            {/* battery */}
            <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x=".5" y=".5" width="21" height="10" rx="2.5" stroke={C.ink} opacity=".5"/><rect x="2" y="2" width="15" height="7" rx="1" fill={C.ink}/><rect x="22" y="3.5" width="1.5" height="4" rx=".5" fill={C.ink} opacity=".5"/></svg>
          </div>
        </div>
        {/* browser chrome (recipient web view) */}
        {browserChrome && (
          <div style={{ position: "absolute", top: 44, left: 0, right: 0, height: 40, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", background: "#EBE7E0", borderBottom: `1px solid ${C.border}`, zIndex: 29, fontFamily: sans }}>
            <div style={{ display: "flex", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#C0B8B0" }}/>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#C0B8B0" }}/>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#C0B8B0" }}/>
            </div>
            <div style={{ flex: 1, background: "#FBF9F5", borderRadius: 8, padding: "5px 10px", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.faint }}>
              <Icon path={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} size={9} color={C.faint}/>
              <span style={{ color: C.inkMuted }}>{browserUrl || "lore.guides/j/valencia"}</span>
            </div>
            <Icon path={<><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.2 4.2l4.3 4.3m7 7l4.3 4.3M1 12h6m10 0h6M4.2 19.8l4.3-4.3m7-7l4.3-4.3"/></>} size={14} color={C.faint}/>
          </div>
        )}
        <div style={{ position: "absolute", top: browserChrome ? 84 : 0, left: 0, right: 0, bottom: 0, overflowY: "auto", overflowX: "hidden", paddingTop: browserChrome ? 0 : 44 }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 130, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.35)", zIndex: 30 }} />
      </div>
    </div>
  );
}

// ─── Logo (wordmark + waymark) ────────────────────────────────────────────
function Logo({ size = 12 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Waymark size={size + 1} />
      <span style={{ fontFamily: serif, fontSize: size + 1, color: C.ink, letterSpacing: "0.07em" }}>Lore Guides</span>
    </div>
  );
}

// ─── NavBar variants ──────────────────────────────────────────────────────
function NavBar({ left, center, right, sticky, bg }) {
  return (
    <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, background: bg || C.bg, position: sticky ? "sticky" : "relative", top: sticky ? 0 : "auto", zIndex: 20 }}>
      <div style={{ minWidth: 60, display: "flex", alignItems: "center" }}>{left || null}</div>
      <div>{center}</div>
      <div style={{ minWidth: 60, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{right || null}</div>
    </div>
  );
}
function BackBtn({ label = "Guides" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, color: C.faint }}>
      <Icon path={Paths.chevLeft} size={14} color={C.faint} />
      <span style={{ fontFamily: serif, fontSize: 13 }}>{label}</span>
    </div>
  );
}
function GuideModeBtn({ active }) {
  return (
    <div style={{ background: active ? C.accent : "transparent", border: active ? "none" : `1px solid ${C.border}`, borderRadius: 2, padding: "5px 11px" }}>
      <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: active ? "#fff" : C.inkMuted }}>Guide</span>
    </div>
  );
}

// ─── Sticky slim header (replaces repeating cover on scroll) ──────────────
function StickyHeader({ city, count, showFilters, filter, onFilter, filters = TIME_CATS }) {
  return (
    <div style={{ position: "sticky", top: 0, background: C.bg, borderBottom: `1px solid ${C.border}`, zIndex: 18, padding: "12px 20px 10px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: showFilters ? 10 : 0 }}>
        <span style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{city}</span>
        <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase" }}>{count} places</span>
      </div>
      {showFilters && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, overflowX: "auto", paddingBottom: 2 }}>
          {filters.map(c => (
            <button key={c} onClick={() => onFilter?.(c)}
              style={{ background: "none", border: "none", padding: "2px 0", cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: filter === c ? C.ink : "#C0B8B0", borderBottom: filter === c ? `1px solid ${C.ink}` : "1px solid transparent", whiteSpace: "nowrap" }}>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cover (full) ──────────────────────────────────────────────────────────
function Cover({ compact, forRecipient }) {
  const size = compact ? 44 : 52;
  return (
    <div style={{ textAlign: "center", padding: compact ? "36px 24px 32px" : "48px 24px 40px" }}>
      <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, margin: "0 0 14px" }}>
        {forRecipient ? `A guide by ${GUIDE.author}` : `A guide by ${GUIDE.author}`}
      </p>
      <h1 style={{ fontFamily: serif, fontSize: size, fontWeight: 400, color: C.ink, margin: "0 0 4px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>{GUIDE.city}</h1>
      <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, margin: "0 0 30px", letterSpacing: "0.2em", textTransform: "uppercase" }}>{GUIDE.country}</p>
      <div style={{ width: 32, height: 1, background: C.accent, margin: "0 auto 30px" }} />
      <p style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.85, color: C.inkMuted, maxWidth: 300, margin: "0 auto", fontStyle: "italic" }}>"{GUIDE.intro}"</p>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
        {[`${GUIDE.places.length} places`, GUIDE.year, GUIDE.context].map((t, i) => (
          <span key={i} style={{ fontFamily: serif, fontSize: 12, color: C.faint }}>
            {i > 0 && <span style={{ margin: "0 9px", color: "#DDD7CE" }}>·</span>}
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Photo block (16:10, warm tint, italic caption below) ─────────────────
function PhotoBlock({ color: bg, caption }) {
  return (
    <div style={{ margin: "16px 0 18px" }}>
      <div style={{ width: "100%", aspectRatio: "16 / 10", backgroundColor: bg, position: "relative", overflow: "hidden", filter: "saturate(0.78)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(250,245,235,0.12), transparent 45%, rgba(60,40,20,0.16))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.24)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>
      {caption && <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "6px 0 0", lineHeight: 1.5 }}>{caption}</p>}
    </div>
  );
}

// ─── Flags (clock glyph for time-sensitive, pill for day trip) ────────────
function TimeSensitiveFlag({ text }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: serif, fontSize: 11, fontStyle: "italic", color: C.time }}>
      <Icon path={Paths.clock} size={10} color={C.time} stroke={1.6} />
      {text}
    </span>
  );
}
function DayTripPill() {
  return (
    <span style={{ display: "inline-block", fontFamily: serif, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.inkMuted, border: `1px solid ${C.borderBold}`, borderRadius: 2, padding: "1px 7px", lineHeight: 1.5 }}>
      Day trip
    </span>
  );
}

// ─── Map: parchment-styled canvas with Waymark pins ────────────────────────
function PlaceMap({ places, active, onPin, height = 240, showWaymark = true }) {
  const ref = React.useRef();
  React.useEffect(() => {
    const c = ref.current; if (!c) return;
    const cx = c.getContext("2d");
    const W = 700, H = height * 2;
    cx.clearRect(0,0,W,H);
    cx.fillStyle = C.mapBg; cx.fillRect(0,0,W,H);
    // water
    cx.beginPath(); cx.ellipse(W*0.82, H*0.55, 90, 120, 0.3, 0, Math.PI*2);
    cx.fillStyle = C.mapWater; cx.fill();
    // parks
    [[0.25,0.32,55,18,0.1],[0.65,0.2,40,14,0]].forEach(([px,py,rx,ry,r])=>{
      cx.beginPath(); cx.ellipse(W*px, H*py, rx, ry, r, 0, Math.PI*2);
      cx.fillStyle = C.mapGreen; cx.fill();
    });
    // grid
    cx.strokeStyle = "rgba(0,0,0,0.05)"; cx.lineWidth = 1.5;
    [0.2,0.35,0.5,0.65,0.8].forEach(t=>{
      cx.beginPath(); cx.moveTo(0,H*t); cx.lineTo(W,H*t); cx.stroke();
      cx.beginPath(); cx.moveTo(W*t,0); cx.lineTo(W*t,H); cx.stroke();
    });
    // attribution
    cx.fillStyle = "rgba(0,0,0,0.25)"; cx.font = `9px ${sans}`;
    cx.fillText("Map · Lore Guides", 10, H-10);
  }, [places, active, height]);

  return (
    <div style={{ position: "relative", border: `1px solid ${C.border}`, overflow: "hidden" }}>
      <canvas ref={ref} width={700} height={height * 2}
        onClick={e => {
          const r = e.currentTarget.getBoundingClientRect();
          const sx = 700 / r.width, sy = (height * 2) / r.height;
          const mx = (e.clientX - r.left) * sx, my = (e.clientY - r.top) * sy;
          let best=null, bestD=Infinity;
          places.forEach(p => {
            const d = Math.hypot(mx - 700*(p.x/100), my - height*2*(p.y/100));
            if (d < bestD) { bestD = d; best = p; }
          });
          if (best && bestD < 50) onPin?.(best.id);
        }}
        style={{ width: "100%", height, display: "block", cursor: "pointer" }}
      />
      {/* Waymark-as-pin overlay */}
      {places.map(p => {
        const isActive = p.id === active;
        const idx = GUIDE.places.findIndex(x => x.id === p.id) + 1;
        return (
          <div key={p.id}
            onClick={() => onPin?.(p.id)}
            style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: 2 }}>
            {showWaymark ? (
              <div style={{ position: "relative", width: isActive ? 30 : 24, height: isActive ? 30 : 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: isActive ? C.accent : C.bg, border: `1px solid ${isActive ? C.accentDeep : C.borderBold}`, boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
                <Waymark size={isActive ? 14 : 11} color={isActive ? "#fff" : C.accent} style={{ position: "relative", zIndex: 1 }} />
                {isActive && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)", fontFamily: sans, fontSize: 9, fontWeight: 600, color: C.accentDeep, background: C.bg, padding: "1px 5px", border: `1px solid ${C.borderBold}`, borderRadius: 2, whiteSpace: "nowrap" }}>
                    {idx}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: isActive ? 26 : 20, height: isActive ? 26 : 20, borderRadius: "50%", background: isActive ? C.accent : C.bg, border: `1.5px solid ${isActive ? C.accentDeep : C.borderBold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontSize: isActive ? 11 : 9, fontWeight: 600, color: isActive ? "#fff" : C.inkMuted, boxShadow: "0 1px 3px rgba(0,0,0,.15)" }}>
                {idx}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Filter bar (single taxonomy) ─────────────────────────────────────────
function FilterBar({ filter, onFilter, cats = TIME_CATS, showMap, onToggleMap }) {
  return (
    <div style={{ padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", flexShrink: 1, minWidth: 0, scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c} onClick={() => onFilter(c)}
            style={{ background: "none", border: "none", padding: "3px 0", cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: filter === c ? C.ink : "#C0B8B0", borderBottom: filter === c ? `1px solid ${C.ink}` : "1px solid transparent", whiteSpace: "nowrap" }}>
            {c}
          </button>
        ))}
      </div>
      <button onClick={onToggleMap}
        style={{ display: "flex", alignItems: "center", gap: 4, background: showMap ? C.ink : "none", border: `1px solid ${showMap ? C.ink : C.border}`, borderRadius: 2, padding: "3px 8px", cursor: "pointer", fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: showMap ? C.bg : C.faint, flexShrink: 0 }}>
        <Icon path={Paths.mapPin} size={10} color="currentColor"/>
        Map
      </button>
    </div>
  );
}

// ─── Dual-facet filter (time primary, type chips secondary) ───────────────
function DualFilterBar({ timeFilter, onTimeFilter, typeFilter, onTypeFilter, showMap, onToggleMap }) {
  return (
    <div style={{ padding: "12px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {TIME_CATS.map(c => (
            <button key={c} onClick={() => onTimeFilter(c)}
              style={{ background: "none", border: "none", padding: "3px 0", cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: timeFilter === c ? C.ink : "#C0B8B0", borderBottom: timeFilter === c ? `1px solid ${C.ink}` : "1px solid transparent", whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
        <button onClick={onToggleMap}
          style={{ display: "flex", alignItems: "center", gap: 4, background: showMap ? C.ink : "none", border: `1px solid ${showMap ? C.ink : C.border}`, borderRadius: 2, padding: "3px 8px", cursor: "pointer", fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: showMap ? C.bg : C.faint, flexShrink: 0 }}>
          <Icon path={Paths.mapPin} size={10} color="currentColor"/>
          Map
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {TYPE_CATS.map(c => (
          <button key={c} onClick={() => onTypeFilter(c)}
            style={{ background: typeFilter === c ? C.surface : "transparent", border: `1px solid ${typeFilter === c ? C.borderBold : C.border}`, borderRadius: 999, padding: "3px 10px", cursor: "pointer", fontFamily: serif, fontSize: 11, color: typeFilter === c ? C.ink : C.faint, fontStyle: typeFilter === c ? "normal" : "italic" }}>{c}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function GuideFooter({ forRecipient }) {
  return (
    <div style={{ padding: "36px 0 20px", textAlign: "center" }}>
      <div style={{ width: 32, height: 1, background: C.accent, margin: "0 auto 24px" }} />
      <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 6px" }}>
        {forRecipient ? `Shared with love by ${GUIDE.author}` : `Shared with love by ${GUIDE.author}`}
      </p>
      <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 28px" }}>Enjoy {GUIDE.city}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: 0.3 }}>
        <Waymark size={11}/>
        <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.ink }}>Lore Guides</span>
      </div>
    </div>
  );
}

Object.assign(window, { Phone, Logo, NavBar, BackBtn, GuideModeBtn, StickyHeader, Cover, PhotoBlock, TimeSensitiveFlag, DayTripPill, PlaceMap, FilterBar, DualFilterBar, GuideFooter });
