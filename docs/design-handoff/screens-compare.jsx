// Old-vs-new comparisons — the 2 changes most worth showing side-by-side.

// ─── "Old" re-creations, compressed. Just enough to read the delta. ───────

function OldCoverSticky() {
  // Original: cover stays sticky at top even after scroll.
  return (
    <Phone height={640} label="Old · cover stays sticky">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <Cover compact />
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ padding: "10px 0", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink }}>Eat · Drink · See · Do</span>
          <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Map</span>
        </div>
        {GUIDE.places.slice(0,2).map((p, i) => (
          <div key={p.id} style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.ink }}>{p.name}</div>
            <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", margin: "3px 0 0" }}>{p.type} · {p.nbhd}</div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function NewCoverCollapse() {
  // New: cover scrolls away, slim sticky header replaces.
  return (
    <Phone height={640} label="New · cover collapses to slim header">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={GUIDE.places.length} showFilters filter="All" onFilter={()=>{}} />
      <div style={{ padding: "0 20px 28px" }}>
        <DraftsBanner count={GUIDE.drafts.length} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.slice(0,3).map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} />)}
        </div>
      </div>
    </Phone>
  );
}

function OldDraftsBottom() {
  // Original: drafts shown in a "Places to decide on" list at the bottom of the screen.
  return (
    <Phone height={640} label="Old · drafts at bottom of list">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <div style={{ padding: "20px 20px 0", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontFamily: serif, fontSize: 15, color: C.ink }}>Valencia</span>
        <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: 10 }}>{GUIDE.places.length} places</span>
        <div style={{ padding: "12px 0 10px", display: "flex", gap: 14 }}>
          {["All","Eat","Drink","See","Do"].map((c,i) => (
            <span key={c} style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: i===0 ? C.ink : "#C0B8B0", borderBottom: i===0 ? `1px solid ${C.ink}` : "none", paddingBottom: 2 }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px 28px" }}>
        {GUIDE.places.slice(0,2).map((p, i) => (
          <div key={p.id} style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: serif, fontSize: 16, color: C.ink }}>{p.name}</div>
            <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", margin: "3px 0 0" }}>{p.type} · {p.nbhd}</div>
          </div>
        ))}
        {/* Drafts section */}
        <div style={{ padding: "28px 0 0" }}>
          <h4 style={{ fontFamily: serif, fontSize: 13, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 400 }}>Places to decide on</h4>
          <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "0 0 14px" }}>Still need a note — not shared yet</p>
          {GUIDE.drafts.slice(0,4).map(d => (
            <div key={d.id} style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}`, opacity: 0.55 }}>
              <div style={{ fontFamily: serif, fontSize: 15, color: C.draftText, fontStyle: "italic" }}>{d.name}</div>
              <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", margin: "3px 0 0" }}>{d.type} · {d.nbhd}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function NewDraftsSheet() {
  return (
    <Phone height={640} label="New · drafts banner → modal sheet">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={GUIDE.places.length} showFilters filter="All" onFilter={()=>{}} />
      <div style={{ padding: "0 20px 28px" }}>
        <DraftsBanner count={GUIDE.drafts.length} />
        <div style={{ marginTop: 10 }}>
          {GUIDE.places.slice(0, 2).map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} />)}
        </div>
      </div>
      <DraftsSheet open drafts={GUIDE.drafts.slice(0,4)} onClose={()=>{}} onPick={()=>{}} />
    </Phone>
  );
}

function OldTypeTaxonomy() {
  // Original primary grouping is Eat/Drink/See/Do.
  return (
    <Phone height={640} label="Old · grouped by type">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: serif, fontSize: 15, color: C.ink }}>Valencia</span>
          <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>{GUIDE.places.length} places</span>
        </div>
        <div style={{ display: "flex", gap: 14, paddingBottom: 10 }}>
          {TYPE_CATS.map((c,i) => (
            <span key={c} style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: i===0 ? C.ink : "#C0B8B0", borderBottom: i===0 ? `1px solid ${C.ink}` : "none", paddingBottom: 2 }}>{c}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px" }}>
        {GUIDE.places.slice(0,3).map((p, i) => (
          <div key={p.id} style={{ padding: "16px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: serif, fontSize: 17, color: C.ink }}>{p.name}</div>
            <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", margin: "3px 0 0" }}>{p.type} · {p.nbhd}</div>
            <p style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted, fontStyle: "italic", margin: "6px 0 0" }}>"{p.vibe}"</p>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function NewTimeTaxonomy() {
  return (
    <Phone height={640} label="New · grouped by time of day">
      <NavBar left={<BackBtn />} center={<Logo />} right={<GuideModeBtn active />} />
      <StickyHeader city="Valencia" count={GUIDE.places.length} showFilters filter="All" onFilter={()=>{}} />
      <div style={{ padding: "0 20px" }}>
        {GUIDE.places.slice(0,3).map((p, i) => <PlaceRow key={p.id} place={p} number={i+1} />)}
      </div>
    </Phone>
  );
}

// ─── Before/after labels used in canvas sections ──────────────────────────
function OldLabel({ children }) {
  return <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.faint, background: C.surface, padding: "2px 8px", border: `1px solid ${C.border}`, borderRadius: 2 }}>{children || "Before"}</span>;
}
function NewLabel({ children }) {
  return <span style={{ fontFamily: serif, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: C.accent, padding: "2px 8px", borderRadius: 2 }}>{children || "After"}</span>;
}

Object.assign(window, { OldCoverSticky, NewCoverCollapse, OldDraftsBottom, NewDraftsSheet, OldTypeTaxonomy, NewTimeTaxonomy, OldLabel, NewLabel });
