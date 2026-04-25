// Recipient view — non-user, mobile web, browser chrome.
// Recipient can: save guide, save individual places, share onward. Read-only otherwise.

function RecipientPlaceRow({ place, number, saved, onSave, onClick, expanded }) {
  return (
    <div style={{ padding: "20px 0", borderTop: `1px solid ${C.border}` }}>
      <div onClick={onClick} style={{ display: "flex", alignItems: "baseline", gap: 16, cursor: "pointer" }}>
        <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, letterSpacing: "0.1em", flexShrink: 0, width: 20 }}>{String(number).padStart(2, "0")}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: serif, fontSize: 19, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.005em", lineHeight: 1.25 }}>{place.name}</h3>
            {place.dayTrip && <DayTripPill />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{place.time} · {place.type}</span>
            <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic" }}>{place.nbhd}</span>
            {place.timeSensitive && <TimeSensitiveFlag text={place.timeSensitive} />}
          </div>
          <p style={{ fontFamily: serif, fontSize: 14, fontStyle: "italic", color: C.inkMuted, margin: 0, lineHeight: 1.5 }}>"{place.vibe}"</p>
          {expanded && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>{GUIDE.author}'s note</p>
              <p style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.7, color: C.inkMuted, margin: 0 }}>{place.note}</p>
            </div>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); onSave?.(); }} style={{ background: "none", border: "none", padding: 6, cursor: "pointer", flexShrink: 0 }}>
          <Icon path={Paths.bookmark} size={16} color={saved ? C.accent : C.faint} fill={saved ? C.accent : "none"} />
        </button>
      </div>
    </div>
  );
}

// 7.1 Recipient — cover
function Screen_RecipientCover() {
  const [saved, setSaved] = React.useState(new Set());
  return (
    <Phone height={812} browserChrome browserUrl="lore.guides/j/valencia" label="7.1 Recipient · cover">
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <Logo size={11} />
        <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${C.borderBold}`, borderRadius: 2, padding: "4px 10px", cursor: "pointer", fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkMuted }}>
          <Icon path={Paths.share} size={10} color={C.inkMuted} /> Share
        </button>
      </div>
      <Cover forRecipient />
      <div style={{ padding: "0 20px 28px" }}>
        {/* save-full-guide CTA */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", background: C.ink, border: "none", borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.bg }}>
            <Icon path={Paths.bookmarkFilled} size={11} color={C.bg} fill={C.bg} />
            Save guide
          </button>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 14px", background: "none", border: `1px solid ${C.borderBold}`, borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkMuted }}>
            <Icon path={Paths.mapPin} size={11} color={C.inkMuted} />
            Map
          </button>
        </div>
        <FilterBar filter="All" onFilter={()=>{}} cats={TIME_CATS} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.slice(0,3).map((p, i) => (
            <RecipientPlaceRow key={p.id} place={p} number={i+1} saved={saved.has(p.id)} onSave={() => setSaved(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />
          ))}
        </div>
      </div>
    </Phone>
  );
}

// 7.2 Recipient — list scrolled, expanded card showing author's note
function Screen_RecipientList() {
  const [saved, setSaved] = React.useState(new Set([2,3]));
  return (
    <Phone height={812} browserChrome browserUrl="lore.guides/j/valencia" label="7.2 Recipient · list">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <Logo size={11} />
        <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: `1px solid ${C.borderBold}`, borderRadius: 2, padding: "4px 10px", cursor: "pointer", fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.inkMuted }}>
          <Icon path={Paths.share} size={10} color={C.inkMuted} /> Share
        </button>
      </div>
      {/* Slim sticky: title + saved count + filters */}
      <div style={{ position: "sticky", top: 0, background: C.bg, borderBottom: `1px solid ${C.border}`, zIndex: 18, padding: "12px 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>Valencia</span>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{GUIDE.places.length} places</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: serif, fontSize: 11, color: C.accent }}>
            <Icon path={Paths.bookmarkFilled} size={11} color={C.accent} fill={C.accent}/>
            {saved.size} saved
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {TIME_CATS.map(c => (
            <button key={c} style={{ background: "none", border: "none", padding: "2px 0", cursor: "pointer", fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c === "All" ? C.ink : "#C0B8B0", borderBottom: c === "All" ? `1px solid ${C.ink}` : "1px solid transparent", whiteSpace: "nowrap" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ marginTop: 0 }}>
          {GUIDE.places.slice(0, 5).map((p, i) => (
            <RecipientPlaceRow key={p.id} place={p} number={i+1}
              expanded={p.id === 3}
              saved={saved.has(p.id)}
              onSave={() => setSaved(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />
          ))}
        </div>
        <GuideFooter forRecipient />
      </div>
    </Phone>
  );
}

// 7.3 Recipient — place detail (read-only, with "Save this place" CTA)
function Screen_RecipientDetail() {
  const place = GUIDE.places[2];
  const [saved, setSaved] = React.useState(false);
  return (
    <Phone height={812} browserChrome browserUrl="lore.guides/j/valencia" label="7.3 Recipient · place detail">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.faint, cursor: "pointer" }}>
          <Icon path={Paths.chevLeft} size={14} color={C.faint} />
          <span style={{ fontFamily: serif, fontSize: 13 }}>Back</span>
        </div>
        <Logo size={10} />
        <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: "pointer", color: C.faint }}>
          <Icon path={Paths.share} size={14} color={C.faint} />
        </button>
      </div>
      <div style={{ padding: "24px 20px 100px" }}>
        <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {place.time} · {place.type}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: 32, color: C.ink, margin: "0 0 4px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{place.name}</h2>
        <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "0 0 14px" }}>{place.nbhd}</p>
        <p style={{ fontFamily: serif, fontSize: 17, fontStyle: "italic", color: C.inkMuted, margin: "0 0 18px", lineHeight: 1.5, borderLeft: `2px solid ${C.accent}`, paddingLeft: 12 }}>"{place.vibe}"</p>

        <PhotoBlock color={place.photoColor} caption={place.photoCaption}/>

        {/* Author's note — read-only */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontSize: 12, color: "#fff", fontWeight: 500 }}>{GUIDE.authorInitial}</div>
            <div>
              <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, lineHeight: 1.2 }}>A note from {GUIDE.author}</p>
            </div>
          </div>
          <p style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.8, color: C.inkMuted, margin: 0 }}>{place.note}</p>
        </div>

        <div style={{ marginTop: 26, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <a style={{ fontFamily: serif, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            <Icon path={Paths.mapPin} size={11} color={C.accent} /> Open in Maps
          </a>
          <span style={{ color: C.border }}>·</span>
          <a style={{ fontFamily: serif, fontSize: 12, color: C.accent, display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            <Icon path={Paths.external} size={11} color={C.accent} /> Website
          </a>
        </div>
      </div>
      {/* Sticky save bar */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 18px", background: `linear-gradient(to top, ${C.bg} 60%, rgba(250,248,245,0))`, display: "flex", gap: 8 }}>
        <button onClick={() => setSaved(s=>!s)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px", background: saved ? C.accent : C.ink, border: "none", borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff" }}>
          <Icon path={Paths.bookmarkFilled} size={11} color="#fff" fill="#fff" />
          {saved ? "Saved" : "Save this place"}
        </button>
      </div>
    </Phone>
  );
}

// 7.4 Recipient — CTA to save all / create account at bottom of list
function Screen_RecipientBottomCTA() {
  return (
    <Phone height={812} browserChrome browserUrl="lore.guides/j/valencia" label="7.4 Recipient · bottom CTA">
      <div style={{ padding: "40px 20px 28px" }}>
        {/* end-of-guide marker */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 32, height: 1, background: C.accent, margin: "0 auto 20px" }} />
          <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: 0 }}>That's all {GUIDE.author}'s Valencia.</p>
        </div>
        {/* CTA card */}
        <div style={{ padding: "28px 24px 26px", background: C.surface, border: `1px solid ${C.borderBold}`, textAlign: "center" }}>
          <Waymark size={22} color={C.accent}/>
          <h3 style={{ fontFamily: serif, fontSize: 22, color: C.ink, margin: "14px 0 8px", fontWeight: 400, letterSpacing: "-0.01em" }}>Keep this guide</h3>
          <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", lineHeight: 1.6, margin: "0 0 18px" }}>
            Save {GUIDE.author}'s Valencia to your Lore account. Follow friends you trust. Write your own.
          </p>
          <button style={{ width: "100%", padding: "12px", background: C.ink, border: "none", borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg, marginBottom: 8 }}>
            Create account · save guide
          </button>
          <button style={{ width: "100%", padding: "11px", background: "none", border: `1px solid ${C.borderBold}`, borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMuted }}>
            Sign in
          </button>
        </div>
        <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", textAlign: "center", margin: "22px 0 0", lineHeight: 1.6 }}>
          Or simply bookmark this page — it'll always be here.
        </p>
      </div>
    </Phone>
  );
}

Object.assign(window, { RecipientPlaceRow, Screen_RecipientCover, Screen_RecipientList, Screen_RecipientDetail, Screen_RecipientBottomCTA });
