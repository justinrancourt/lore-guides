// Author view — Flow 6 refreshed, screens 6.1 through 6.6
// Key changes from original:
//  - Cover doesn't stay sticky; slim StickyHeader replaces it on scroll
//  - Time-based taxonomy primary (tweakable to type-based or dual-facet)
//  - Drafts = banner → tap → modal sheet (no bottom list)
//  - Time-sensitive = clock glyph + warm ink; Day Trip = pill
//  - Waymark pins on map
//  - "Your note" / "Add note" copy (not "Why I love it")

// ─── Place row (list view) ────────────────────────────────────────────────
function PlaceRow({ place, number, onClick, expanded }) {
  return (
    <div onClick={onClick} style={{ padding: "20px 0", borderTop: `1px solid ${C.border}`, cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, letterSpacing: "0.1em", flexShrink: 0, width: 20 }}>
          {String(number).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: serif, fontSize: 19, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.005em", lineHeight: 1.25 }}>
              {place.name}
            </h3>
            {place.dayTrip && <DayTripPill />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {place.time} · {place.type}
            </span>
            <span style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic" }}>{place.nbhd}</span>
            {place.timeSensitive && <TimeSensitiveFlag text={place.timeSensitive} />}
          </div>
          <p style={{ fontFamily: serif, fontSize: 14, fontStyle: "italic", color: C.inkMuted, margin: "0 0 0", lineHeight: 1.5 }}>
            "{place.vibe}"
          </p>
          {expanded && (
            <div style={{ marginTop: 14, paddingLeft: 0 }}>
              <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>Your note</p>
              <p style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.7, color: C.inkMuted, margin: 0 }}>{place.note}</p>
            </div>
          )}
        </div>
        <Icon path={expanded ? Paths.chevDown : Paths.chevRight} size={14} color={C.faint} />
      </div>
    </div>
  );
}

// ─── Drafts banner (replaces "Places to decide on" section) ───────────────
function DraftsBanner({ count, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: C.bannerBg, border: `1px solid ${C.bannerBorder}`, borderLeft: `3px solid ${C.bannerIcon}`, padding: "10px 14px", cursor: "pointer", textAlign: "left", margin: "14px 0 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon path={Paths.edit} size={13} color={C.bannerIcon} />
        <span style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted }}>
          <span style={{ color: C.ink }}>{count} drafts</span> waiting for a note
        </span>
      </div>
      <Icon path={Paths.chevRight} size={12} color={C.bannerIcon} />
    </button>
  );
}

// ─── Drafts modal sheet ───────────────────────────────────────────────────
function DraftsSheet({ open, onClose, drafts, onPick }) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(30,25,20,0.38)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.bg, borderRadius: "14px 14px 0 0", maxHeight: "78%", overflowY: "auto", boxShadow: "0 -8px 30px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "12px 0 8px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.borderBold }} />
        </div>
        <div style={{ padding: "6px 22px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontFamily: serif, fontSize: 18, color: C.ink, margin: 0, fontWeight: 400 }}>Drafts</h3>
            <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "3px 0 0" }}>Places waiting for your note</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", padding: 6, cursor: "pointer" }}>
            <Icon path={Paths.x} size={16} color={C.faint} />
          </button>
        </div>
        {drafts.map((d, i) => (
          <button key={d.id} onClick={() => onPick(d)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 22px", background: "none", border: "none", borderBottom: i < drafts.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", textAlign: "left" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: serif, fontSize: 16, color: C.ink, marginBottom: 3, letterSpacing: "-0.005em" }}>{d.name}</div>
              <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic" }}>
                {d.nbhd} · {d.type}
              </div>
            </div>
            <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>Add note</span>
          </button>
        ))}
        <div style={{ padding: "16px 22px 28px" }}>
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px", background: "none", border: `1px dashed ${C.borderBold}`, borderRadius: 2, cursor: "pointer", fontFamily: serif, fontSize: 13, color: C.inkMuted }}>
            <Icon path={Paths.plus} size={12} color={C.inkMuted}/>
            Add a place
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Place detail view (6.3) ──────────────────────────────────────────────
function PlaceDetail({ place, onBack }) {
  const [editingNote, setEditingNote] = React.useState(false);
  const [note, setNote] = React.useState(place.note);
  return (
    <div>
      <NavBar
        left={<div onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 3, color: C.faint, cursor: "pointer" }}>
          <Icon path={Paths.chevLeft} size={14} color={C.faint} />
          <span style={{ fontFamily: serif, fontSize: 13 }}>Valencia</span>
        </div>}
        center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{String(GUIDE.places.findIndex(p => p.id === place.id) + 1).padStart(2, "0")} of {GUIDE.places.length}</span>}
        right={<Icon path={Paths.moreH} size={16} color={C.faint} />}
        sticky
      />
      <div style={{ padding: "24px 20px 80px" }}>
        <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 10px" }}>
          {place.time} · {place.type}
        </p>
        <h2 style={{ fontFamily: serif, fontSize: 32, color: C.ink, margin: "0 0 4px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.1 }}>{place.name}</h2>
        <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "0 0 14px" }}>{place.nbhd}</p>
        {place.timeSensitive && (
          <div style={{ margin: "0 0 12px" }}>
            <TimeSensitiveFlag text={place.timeSensitive} />
          </div>
        )}
        <p style={{ fontFamily: serif, fontSize: 17, fontStyle: "italic", color: C.inkMuted, margin: "0 0 18px", lineHeight: 1.5, borderLeft: `2px solid ${C.accent}`, paddingLeft: 12 }}>"{place.vibe}"</p>

        <PhotoBlock color={place.photoColor} caption={place.photoCaption}/>

        {/* Your note */}
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Your note</p>
            <button onClick={() => setEditingNote(e => !e)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: C.accent, fontFamily: serif, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <Icon path={Paths.edit} size={11} color={C.accent}/>
              {editingNote ? "Done" : "Edit"}
            </button>
          </div>
          {editingNote ? (
            <textarea value={note} onChange={e => setNote(e.target.value)}
              style={{ width: "100%", minHeight: 120, padding: 12, background: C.surface, border: `1px solid ${C.borderBold}`, borderRadius: 2, fontFamily: serif, fontSize: 15, lineHeight: 1.7, color: C.ink, resize: "vertical", boxSizing: "border-box" }} />
          ) : (
            <p style={{ fontFamily: serif, fontSize: 15, lineHeight: 1.8, color: C.inkMuted, margin: 0 }}>{note}</p>
          )}
        </div>

        {/* Metadata row */}
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
    </div>
  );
}

// ─── AUTHOR: 6.1 cover + top of list (before scroll) ──────────────────────
function Screen_Cover({ taxonomy = "time" }) {
  return (
    <Phone height={812} label="6.1 Cover + top of list">
      <NavBar
        left={<BackBtn />}
        center={<Logo />}
        right={<GuideModeBtn active />}
      />
      <Cover />
      <div style={{ padding: "0 20px 28px" }}>
        {taxonomy === "dual" ? (
          <DualFilterBar timeFilter="All" onTimeFilter={()=>{}} typeFilter="All" onTypeFilter={()=>{}} />
        ) : (
          <FilterBar filter="All" onFilter={()=>{}} cats={taxonomy === "type" ? TYPE_CATS : TIME_CATS} />
        )}
        <DraftsBanner count={GUIDE.drafts.length} onClick={()=>{}} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.slice(0,2).map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} />)}
        </div>
      </div>
    </Phone>
  );
}

// ─── AUTHOR: 6.2 list scrolled — sticky slim header ───────────────────────
function Screen_ListScrolled({ taxonomy = "time" }) {
  const cats = taxonomy === "type" ? TYPE_CATS : TIME_CATS;
  return (
    <Phone height={812} label="6.2 List scrolled — slim header">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={GUIDE.places.length} showFilters filter="All" onFilter={()=>{}} filters={cats} />
      <div style={{ padding: "0 20px 28px" }}>
        <DraftsBanner count={GUIDE.drafts.length} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} expanded={p.id === 2} />)}
        </div>
        <GuideFooter />
      </div>
    </Phone>
  );
}

// ─── AUTHOR: 6.3 place detail ─────────────────────────────────────────────
function Screen_PlaceDetail() {
  return (
    <Phone height={812} label="6.3 Place detail">
      <PlaceDetail place={GUIDE.places[2]} onBack={()=>{}} />
    </Phone>
  );
}

// ─── AUTHOR: 6.4 map view ─────────────────────────────────────────────────
function Screen_MapView() {
  const [active, setActive] = React.useState(3);
  const p = GUIDE.places.find(x => x.id === active);
  return (
    <Phone height={812} label="6.4 Map view">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontFamily: serif, fontSize: 18, color: C.ink, letterSpacing: "-0.005em" }}>Valencia</span>
          <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{GUIDE.places.length} places</span>
        </div>
        <FilterBar filter="All" onFilter={()=>{}} cats={TIME_CATS} showMap onToggleMap={()=>{}} />
      </div>
      {/* Map fills to bottom of phone; peek card floats over lower portion */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 148, bottom: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <PlaceMap places={GUIDE.places} active={active} onPin={setActive} height={520}/>
        </div>
      </div>
      {/* Bottom detail card for active pin */}
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 20, background: C.bg, border: `1px solid ${C.borderBold}`, padding: "14px 16px", boxShadow: "0 6px 18px rgba(30,25,20,0.15)", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: serif, fontSize: 10, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{p.time} · {p.type}</span>
          {p.dayTrip && <DayTripPill />}
        </div>
        <h3 style={{ fontFamily: serif, fontSize: 19, color: C.ink, margin: "0 0 3px", fontWeight: 400, letterSpacing: "-0.005em" }}>{p.name}</h3>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 8px" }}>{p.nbhd}</p>
        {p.timeSensitive && <div style={{ marginBottom: 8 }}><TimeSensitiveFlag text={p.timeSensitive} /></div>}
        <p style={{ fontFamily: serif, fontSize: 14, fontStyle: "italic", color: C.inkMuted, margin: 0, lineHeight: 1.4 }}>"{p.vibe}"</p>
      </div>
    </Phone>
  );
}

// ─── AUTHOR: 6.5 drafts sheet open ────────────────────────────────────────
function Screen_DraftsSheet() {
  return (
    <Phone height={812} label="6.5 Drafts sheet">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={GUIDE.places.length} showFilters filter="All" onFilter={()=>{}} />
      <div style={{ padding: "0 20px 28px" }}>
        <DraftsBanner count={GUIDE.drafts.length} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.slice(0, 3).map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} />)}
        </div>
      </div>
      <DraftsSheet open drafts={GUIDE.drafts} onClose={()=>{}} onPick={()=>{}} />
    </Phone>
  );
}

// ─── AUTHOR: 6.6 filtered by Evening ──────────────────────────────────────
function Screen_Filtered() {
  const filtered = GUIDE.places.filter(p => p.time === "Evening" || p.time === "Night");
  return (
    <Phone height={812} label="6.6 Filtered — Evening">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={filtered.length} showFilters filter="Evening" onFilter={()=>{}} />
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ marginTop: 10 }}>
          {filtered.map((p, i) => <PlaceRow key={p.id} place={p} number={GUIDE.places.findIndex(x => x.id === p.id)+1} />)}
        </div>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", textAlign: "center", margin: "36px 0 0" }}>
          Showing {filtered.length} of {GUIDE.places.length} places
        </p>
      </div>
    </Phone>
  );
}

Object.assign(window, { PlaceRow, DraftsBanner, DraftsSheet, PlaceDetail, Screen_Cover, Screen_ListScrolled, Screen_PlaceDetail, Screen_MapView, Screen_DraftsSheet, Screen_Filtered });
