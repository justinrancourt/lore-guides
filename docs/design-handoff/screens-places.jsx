// Places-model screens: onboarding v2 (save-first-place), quick capture,
// My Places, generalized new-guide, revised Home.
//
// Depends on: tokens.jsx, primitives.jsx, screens-flows.jsx (for IlloCompass/IlloMap).

// ─── Onboarding v2 — first action is "save a place" ──────────────────────
function Screen_OnbV2_FirstPlace() {
  return (
    <Phone height={832} label="1.4′ First place (generalized)">
      <NavBar left={<BackBtn label="Back"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Step 3 of 3</span>}/>
      <div style={{ padding: "44px 28px 0", textAlign: "center" }}>
        <IlloMap size={110}/>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "24px 0 12px" }}>Start somewhere small</p>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: C.ink, margin: "0 0 12px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.15 }}>Save a place you love.</h2>
        <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 26px", lineHeight: 1.6 }}>Not a whole guide — just one place. You can file it later, or build a guide around it.</p>

        <div style={{ background: C.surface, border: `1px solid ${C.borderBold}`, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, textAlign: "left", marginBottom: 10 }}>
          <Icon path={Paths.mapPin} size={14} color={C.faint}/>
          <input placeholder="A restaurant, a bar, a view…" style={{ flex: 1, background: "none", border: "none", fontFamily: serif, fontSize: 15, color: C.ink, outline: "none" }}/>
        </div>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: 0, textAlign: "left" }}>Or start from <span style={{ color: C.accent, fontStyle: "normal" }}>where you are now</span></p>
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 36, textAlign: "center" }}>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: 0 }}>Prefer to start a full guide? <span style={{ color: C.accent, fontStyle: "normal" }}>Do that instead</span></p>
      </div>
    </Phone>
  );
}

// ─── Quick capture — the 5-second flow ────────────────────────────────────
function Screen_Capture_Sheet() {
  return (
    <Phone height={832} label="Capture · from anywhere">
      {/* Dimmed underlay suggesting the sheet is over Home */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(30,25,20,0.35)" }}/>
      {/* Sheet */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.bg, borderRadius: "16px 16px 0 0", padding: "10px 0 28px", boxShadow: "0 -10px 40px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.borderBold, margin: "0 auto 16px" }}/>
        <div style={{ padding: "0 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h3 style={{ fontFamily: serif, fontSize: 20, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em" }}>Capture a place</h3>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Save</span>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.borderBold}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
            <Icon path={Paths.mapPin} size={13} color={C.accent}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 14, color: C.ink }}>The Anchor</div>
              <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", marginTop: 1 }}>Islamorada, FL · Bar</div>
            </div>
            <span style={{ fontFamily: serif, fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Change</span>
          </div>
          <p style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", margin: "0 0 18px", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon path={Paths.mapPin} size={9} color={C.faint}/> Detected from your current location
          </p>

          <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>A note to your future self</label>
          <textarea defaultValue="Sunset dock bar. Key lime pie was surprisingly great."
            style={{ width: "100%", minHeight: 76, padding: 11, background: C.surface, border: `1px solid ${C.borderBold}`, borderRadius: 2, fontFamily: serif, fontSize: 14, lineHeight: 1.6, color: C.ink, outline: "none", resize: "none", fontStyle: "italic", boxSizing: "border-box" }}/>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", marginRight: 2, alignSelf: "center" }}>Type</span>
            {["Eat","Drink","See","Do"].map((t,i) => (
              <span key={t} style={{ fontFamily: serif, fontSize: 12, padding: "4px 10px", border: `1px solid ${i===1 ? C.ink : C.border}`, color: i===1 ? C.ink : C.faint, background: i===1 ? C.surface : "transparent", borderRadius: 999 }}>{t}</span>
            ))}
          </div>

          <div style={{ marginTop: 18, padding: "10px 0 0", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted, fontStyle: "italic" }}>Save to My Places</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: serif, fontSize: 11, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              File in guide <Icon path={Paths.chevRight} size={10} color={C.accent}/>
            </span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

function Screen_Capture_GuidePicker() {
  return (
    <Phone height={832} label="Capture · file in guide">
      <div style={{ position: "absolute", inset: 0, background: "rgba(30,25,20,0.35)" }}/>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: C.bg, borderRadius: "16px 16px 0 0", paddingBottom: 28, boxShadow: "0 -10px 40px rgba(0,0,0,0.25)", maxHeight: "80%", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: C.borderBold, margin: "10px auto 14px" }}/>
        <div style={{ padding: "0 22px 14px", display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${C.border}` }}>
          <div>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase" }}>Filing</span>
            <h3 style={{ fontFamily: serif, fontSize: 18, color: C.ink, margin: "2px 0 0", fontWeight: 400 }}>The Anchor</h3>
          </div>
          <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Done</span>
        </div>

        <div style={{ overflowY: "auto" }}>
          <div style={{ padding: "14px 22px 6px" }}>
            <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, margin: 0 }}>Your guides</p>
          </div>
          {MY_GUIDES.map((g, i) => {
            const checked = g.id === "south-fl"; // suggested match based on location
            return (
              <div key={g.id} style={{ padding: "12px 22px", display: "flex", alignItems: "center", gap: 12, borderTop: i===0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, background: checked ? C.surface : "transparent" }}>
                <div style={{ width: 18, height: 18, border: `1.5px solid ${checked ? C.accent : C.borderBold}`, borderRadius: 2, background: checked ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {checked && <Icon path={Paths.check} size={11} color="#fff"/>}
                </div>
                <div style={{ width: 34, height: 34, background: g.color, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: serif, fontSize: 14, color: C.ink }}>{g.title}</div>
                  <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", marginTop: 1 }}>{g.scope} · {g.count} places</div>
                </div>
                {checked && <span style={{ fontFamily: serif, fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Suggested</span>}
              </div>
            );
          })}
          <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", gap: 10, color: C.accent, cursor: "pointer" }}>
            <Icon path={Paths.plus} size={13} color={C.accent}/>
            <span style={{ fontFamily: serif, fontSize: 14 }}>Start a new guide with this place</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── My Places (shoebox) ─────────────────────────────────────────────────
function MyPlacesCard({ p }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 56, height: 56, background: p.color, flexShrink: 0, filter: "saturate(0.8)" }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
          <span style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{p.name}</span>
          <span style={{ fontFamily: serif, fontSize: 10, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>{p.type}</span>
        </div>
        <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", marginBottom: 6 }}>{p.nbhd} · {p.savedOn}</div>
        {p.note && <div style={{ fontFamily: serif, fontSize: 12, color: C.inkMuted, lineHeight: 1.55, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{p.note}"</div>}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {p.guides.length === 0 ? (
            <span style={{ fontFamily: serif, fontSize: 10, color: C.draftText, background: C.draftBg, border: `1px solid ${C.draftBorder}`, padding: "2px 7px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>Unfiled</span>
          ) : p.guides.map(gid => {
            const g = MY_GUIDES.find(x => x.id === gid);
            return g ? (
              <span key={gid} style={{ fontFamily: serif, fontSize: 10, color: C.inkMuted, background: C.surface, border: `1px solid ${C.border}`, padding: "2px 7px", borderRadius: 2, letterSpacing: "0.04em" }}>{g.title}</span>
            ) : null;
          })}
          {p.fromGuide && <span style={{ fontFamily: serif, fontSize: 10, color: C.sageDeep, fontStyle: "italic" }}>Saved from {p.fromGuide}</span>}
        </div>
      </div>
    </div>
  );
}

function Screen_MyPlaces_All() {
  return (
    <Phone height={832} label="My Places · all">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Guides</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Shared</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 0 8px" }}>
          <h2 style={{ fontFamily: serif, fontSize: 26, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em" }}>Every place I've saved</h2>
        </div>
        <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "0 0 8px" }}>{MY_PLACES.length} places · {MY_PLACES.filter(x => x.guides.length === 0).length} unfiled</p>

        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0 14px" }}>
          {["All","Unfiled","Eat","Drink","See","Do"].map((c,i) => (
            <span key={c} style={{ fontFamily: serif, fontSize: 11, padding: "4px 11px", border: `1px solid ${i===0 ? C.ink : C.border}`, color: i===0 ? C.ink : C.faint, background: i===0 ? C.surface : "transparent", borderRadius: 999, whiteSpace: "nowrap" }}>{c}</span>
          ))}
        </div>

        {MY_PLACES.map(p => <MyPlacesCard key={p.id} p={p}/>)}
        <div style={{ height: 60 }}/>
      </div>
      {/* Floating capture button */}
      <div style={{ position: "absolute", right: 20, bottom: 26, width: 52, height: 52, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.25)", zIndex: 30 }}>
        <Icon path={Paths.plus} size={22} color={C.bg} stroke={1.7}/>
      </div>
    </Phone>
  );
}

function Screen_MyPlaces_Unfiled() {
  const unfiled = MY_PLACES.filter(p => p.guides.length === 0);
  return (
    <Phone height={832} label="My Places · unfiled filter">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Guides</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Shared</span>
        </div>
        <div style={{ padding: "16px 0 6px" }}>
          <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "0 0 6px" }}>Unfiled</p>
          <h2 style={{ fontFamily: serif, fontSize: 22, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1.2 }}>Places without a home</h2>
          <p style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted, fontStyle: "italic", margin: "6px 0 0" }}>Captured in the wild. Build a guide around them when the shape becomes clear.</p>
        </div>

        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "14px 0" }}>
          {["All","Unfiled","Eat","Drink","See","Do"].map((c,i) => (
            <span key={c} style={{ fontFamily: serif, fontSize: 11, padding: "4px 11px", border: `1px solid ${i===1 ? C.ink : C.border}`, color: i===1 ? C.ink : C.faint, background: i===1 ? C.surface : "transparent", borderRadius: 999, whiteSpace: "nowrap" }}>{c}</span>
          ))}
        </div>

        {unfiled.map(p => <MyPlacesCard key={p.id} p={p}/>)}

        <button style={{ width: "100%", marginTop: 20, padding: "14px", background: "none", border: `1px dashed ${C.borderBold}`, cursor: "pointer", fontFamily: serif, fontSize: 13, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Waymark size={12} color={C.accent}/> Build a guide from these
        </button>
        <div style={{ height: 40 }}/>
      </div>
    </Phone>
  );
}

// ─── My Places · unfiled detail (place with no guide yet) ────────────────
function Screen_MyPlaces_Detail() {
  const p = MY_PLACES.find(x => x.id === 20); // The Anchor
  return (
    <Phone height={832} label="Place · unfiled detail">
      <NavBar left={<BackBtn label="My places"/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "0 0 80px" }}>
        <div style={{ width: "100%", aspectRatio: "16 / 10", background: p.color, filter: "saturate(0.8)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(250,245,235,0.12), transparent 45%, rgba(60,40,20,0.16))" }}/>
        </div>
        <div style={{ padding: "20px 22px 0" }}>
          <span style={{ fontFamily: serif, fontSize: 10, color: C.draftText, background: C.draftBg, border: `1px solid ${C.draftBorder}`, padding: "3px 8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Unfiled</span>
          <h2 style={{ fontFamily: serif, fontSize: 28, color: C.ink, margin: "12px 0 4px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.15 }}>{p.name}</h2>
          <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "0 0 2px" }}>{p.nbhd}</p>
          <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase", margin: "10px 0 18px" }}>
            {p.type} · Captured {p.savedOn}
          </p>

          <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, margin: "0 0 8px" }}>Your note</p>
          <p style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.75, color: C.ink, margin: "0 0 22px" }}>"{p.note}"</p>

          <div style={{ padding: "14px 16px", background: C.surface, border: `1px solid ${C.borderBold}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Waymark size={13} color={C.accent}/>
              <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>File this place</span>
            </div>
            <p style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted, fontStyle: "italic", margin: "0 0 12px", lineHeight: 1.55 }}>Add to one of your guides, or start something new.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {MY_GUIDES.slice(0, 3).map(g => (
                <span key={g.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: serif, fontSize: 12, padding: "5px 10px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 2 }}>
                  <div style={{ width: 10, height: 10, background: g.color, borderRadius: 1 }}/>
                  {g.title}
                </span>
              ))}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: serif, fontSize: 12, padding: "5px 10px", background: "none", border: `1px dashed ${C.borderBold}`, borderRadius: 2, color: C.accent }}>
                <Icon path={Paths.plus} size={10} color={C.accent}/> New guide
              </span>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── Generalized new-guide creation ──────────────────────────────────────
function Screen_NewGuide_V2_TypePicker() {
  return (
    <Phone height={832} label="New guide · pick shape">
      <NavBar left={<div style={{ display: "flex", alignItems: "center", gap: 3, color: C.faint }}><Icon path={Paths.x} size={14} color={C.faint}/><span style={{ fontFamily: serif, fontSize: 13 }}>Cancel</span></div>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>New guide</span>}/>
      <div style={{ padding: "32px 26px 0" }}>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "0 0 12px" }}>What shape is it?</p>
        <h2 style={{ fontFamily: serif, fontSize: 28, color: C.ink, margin: "0 0 10px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.15 }}>A guide can be anything you want it to be.</h2>
        <p style={{ fontFamily: serif, fontSize: 14, color: C.inkMuted, fontStyle: "italic", margin: "0 0 28px", lineHeight: 1.6 }}>Pick the shape that fits. You can change your mind later.</p>

        {GUIDE_TYPES.map((g, i) => (
          <div key={g.id} style={{ padding: "14px 16px", borderTop: i===0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, background: i===1 ? C.surface : "transparent", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {g.id === "city"   && <Icon path={<><path d="M3 21h18M6 21V7l6-4 6 4v14M10 9h.01M14 9h.01M10 13h.01M14 13h.01M10 17h.01M14 17h.01"/></>} size={19} color={C.accent}/>}
              {g.id === "region" && <Icon path={<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v16 M15 6v16"/>} size={19} color={C.accent}/>}
              {g.id === "trip"   && <Icon path={<><path d="M3 12h14l4-4v8l-4 4H3z"/><circle cx="7" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/></>} size={19} color={C.accent}/>}
              {g.id === "theme"  && <Waymark size={18} color={C.accent}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{g.label}</div>
              <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", marginTop: 2 }}>{g.hint}</div>
            </div>
            <Icon path={Paths.chevRight} size={14} color={C.faint}/>
          </div>
        ))}

        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "22px 0 0", textAlign: "center" }}>Not sure? <span style={{ color: C.accent, fontStyle: "normal" }}>Just give it a name</span></p>
      </div>
    </Phone>
  );
}

function Screen_NewGuide_V2_Theme() {
  return (
    <Phone height={832} label="New guide · theme">
      <NavBar left={<BackBtn label="Back"/>} center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Theme guide</span>}/>
      <div style={{ padding: "28px 24px 0" }}>
        <p style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.accent, margin: "0 0 12px" }}>A guide to</p>
        <input defaultValue="Coffee shops, considered" placeholder="What's this a guide to?"
          style={{ width: "100%", padding: "2px 0 8px", background: "none", border: "none", borderBottom: `1px solid ${C.ink}`, fontFamily: serif, fontSize: 34, color: C.ink, outline: "none", fontWeight: 400, letterSpacing: "-0.02em", boxSizing: "border-box" }}/>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "10px 0 26px" }}>A few words. Don't overthink the title.</p>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Scope · optional</label>
        <input placeholder="E.g. 'Worldwide', 'SF Bay Area', 'Only places that roast their own'"
          style={{ width: "100%", padding: "6px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 14, color: C.ink, outline: "none", boxSizing: "border-box", marginBottom: 22 }}/>

        <label style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.faint, display: "block", marginBottom: 6 }}>Why this guide</label>
        <textarea placeholder="What makes a place belong here? What are you looking for?" defaultValue="Not the best coffee — the best coffee SHOPS. Places I'd happily spend three hours in with a book. Mornings preferred."
          style={{ width: "100%", minHeight: 100, padding: "6px 0", background: "none", border: "none", borderBottom: `1px solid ${C.border}`, fontFamily: serif, fontSize: 15, lineHeight: 1.6, color: C.ink, outline: "none", resize: "none", fontStyle: "italic", boxSizing: "border-box" }}/>

        <div style={{ marginTop: 22, padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon path={Paths.info} size={14} color={C.faint}/>
          <span style={{ fontFamily: serif, fontSize: 12, color: C.inkMuted, fontStyle: "italic", lineHeight: 1.5 }}>Theme guides show all your matching places across cities. No need to pick a place to start.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 22px 22px", background: `linear-gradient(to top, ${C.bg}, rgba(250,248,245,0))` }}>
        <button style={{ width: "100%", padding: "13px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg }}>Create guide</button>
      </div>
    </Phone>
  );
}

// ─── Revised Home with My Places integrated ──────────────────────────────
function GuideRowCard({ g }) {
  const typeLabel = g.type === "city" ? "City" : g.type === "region" ? "Region" : g.type === "trip" ? "Trip" : "Theme";
  return (
    <div style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
      <div style={{ width: 72, height: 52, background: g.color, flexShrink: 0, position: "relative", filter: "saturate(0.9)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.12), transparent)" }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: serif, fontSize: 16, color: C.ink, letterSpacing: "-0.005em" }}>{g.title}</div>
        <div style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", marginTop: 2 }}>{g.scope} · {g.count} places</div>
      </div>
      <span style={{ fontFamily: serif, fontSize: 10, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase", flexShrink: 0 }}>{typeLabel}</span>
    </div>
  );
}

function Screen_Home_V2() {
  return (
    <Phone height={832} label="Home · My places (default)">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Guides</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Shared</span>
        </div>

        {/* Header + count */}
        <div style={{ padding: "18px 0 4px" }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em" }}>Every place I've saved</h2>
          <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "4px 0 0" }}>{MY_PLACES.length} places · 6 unfiled</p>
        </div>

        {/* Unfiled banner — still prominent, first thing after header */}
        <div style={{ marginTop: 14, padding: "11px 14px", background: C.bannerBg, border: `1px solid ${C.bannerBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Waymark size={13} color={C.bannerIcon}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted }}>6 unfiled places</div>
            <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", marginTop: 1 }}>Captured in the wild. File them when you're ready.</div>
          </div>
          <Icon path={Paths.chevRight} size={13} color={C.bannerIcon}/>
        </div>

        {/* Guide filter chips — let user narrow My Places to one guide */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "14px 0 10px", scrollbarWidth: "none" }}>
          <span style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", background: C.ink, color: C.bg, borderRadius: 999, whiteSpace: "nowrap", letterSpacing: "0.06em", textTransform: "uppercase" }}>All</span>
          {MY_GUIDES.slice(0, 3).map(g => (
            <span key={g.id} style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", border: `1px solid ${C.border}`, color: C.inkMuted, borderRadius: 999, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: g.color }}/>
              {g.title}
            </span>
          ))}
          <span style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", border: `1px solid ${C.border}`, color: C.inkMuted, borderRadius: 999, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: "0.06em", textTransform: "uppercase" }}>Unfiled</span>
        </div>

        {/* The actual places */}
        {MY_PLACES.slice(0, 6).map(p => <MyPlacesCard key={p.id} p={p}/>)}

        <div style={{ height: 80 }}/>
      </div>
      {/* Floating capture button */}
      <div style={{ position: "absolute", right: 20, bottom: 26, width: 52, height: 52, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.25)", zIndex: 30 }}>
        <Icon path={Paths.plus} size={22} color={C.bg} stroke={1.7}/>
      </div>
    </Phone>
  );
}

// Home with "Guides" tab selected — the curated side.
function Screen_Home_V2_GuidesTab() {
  return (
    <Phone height={832} label="Home · Guides tab">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>Guides</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Shared</span>
        </div>

        <div style={{ padding: "18px 0 4px" }}>
          <h2 style={{ fontFamily: serif, fontSize: 24, color: C.ink, margin: 0, fontWeight: 400, letterSpacing: "-0.01em" }}>Your guides</h2>
          <p style={{ fontFamily: serif, fontSize: 13, color: C.faint, fontStyle: "italic", margin: "4px 0 0" }}>{MY_GUIDES.length} guides · curated views over your places</p>
        </div>

        <div style={{ marginTop: 18 }}>
          {MY_GUIDES.map(g => <GuideRowCard key={g.id} g={g}/>)}
        </div>

        <button style={{ width: "100%", marginTop: 18, padding: "14px", background: "none", border: `1px dashed ${C.borderBold}`, cursor: "pointer", fontFamily: serif, fontSize: 13, color: C.inkMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon path={Paths.plus} size={12} color={C.inkMuted}/> Start a new guide
        </button>

        <div style={{ height: 80 }}/>
      </div>
      <div style={{ position: "absolute", right: 20, bottom: 26, width: 52, height: 52, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0,0,0,0.25)", zIndex: 30 }}>
        <Icon path={Paths.plus} size={22} color={C.bg} stroke={1.7}/>
      </div>
    </Phone>
  );
}

function Screen_Home_Empty() {
  return (
    <Phone height={832} label="Home · empty state (first run)">
      <NavBar left={<Logo size={12}/>} right={<Icon path={Paths.moreH} size={16} color={C.faint}/>}/>
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 18, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 8, marginBottom: -11 }}>My places</span>
          <span style={{ fontFamily: serif, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>Guides</span>
        </div>
      </div>
      <div style={{ padding: "64px 36px 0", textAlign: "center" }}>
        <IlloCompass size={98}/>
        <h2 style={{ fontFamily: serif, fontSize: 24, color: C.ink, margin: "28px 0 10px", fontWeight: 400, letterSpacing: "-0.015em", lineHeight: 1.2 }}>Nothing here yet — that's fine.</h2>
        <p style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.7, color: C.inkMuted, fontStyle: "italic", margin: "0 auto 30px", maxWidth: 280 }}>
          The best way to start is with one place you love. Filed or unfiled. We'll help you find the shape later.
        </p>
        <button style={{ width: "100%", padding: "13px", background: C.ink, border: "none", cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.bg, marginBottom: 10 }}>Save a place</button>
        <button style={{ width: "100%", padding: "12px", background: "none", border: `1px solid ${C.borderBold}`, cursor: "pointer", fontFamily: serif, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: C.inkMuted }}>Start a guide</button>
        <p style={{ fontFamily: serif, fontSize: 12, color: C.faint, fontStyle: "italic", margin: "20px 0 0" }}>Or <span style={{ color: C.accent, fontStyle: "normal" }}>import from Google Maps</span></p>
      </div>
    </Phone>
  );
}

// ─── My Places · world map ────────────────────────────────────────────────
// All places across all guides on one canvas. Pin color derives from guide
// (unfiled = neutral sage). A peek card surfaces on tap.
//
// The pin coordinates here are intentionally illustrative — a real map
// (Mapbox) would place them geographically. What matters for this mock is
// the visual grammar: cluster → peek → jump to place.

function MapPinCluster({ count, x, y, active }) {
  const s = active ? 38 : 32;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: s, height: s, borderRadius: "50%", background: C.bg, border: `1.5px solid ${active ? C.accent : C.borderBold}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", zIndex: 3, cursor: "pointer" }}>
      <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, color: active ? C.accentDeep : C.inkMuted }}>{count}</span>
    </div>
  );
}

function MapPinOne({ color, x, y, active, waymark = true }) {
  const size = active ? 28 : 22;
  return (
    <div style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", background: color || C.bg, border: `1.5px solid ${active ? C.accentDeep : "rgba(0,0,0,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.18)", zIndex: active ? 4 : 2, cursor: "pointer" }}>
      {waymark && <Waymark size={active ? 13 : 10} color="#fff"/>}
    </div>
  );
}

// A simple parchment-toned world-ish canvas. Abstract landmass shapes —
// doesn't need to be geographically accurate; the point is "your places
// at a glance, across continents."
function WorldCanvas({ height = 360 }) {
  const ref = React.useRef();
  React.useEffect(() => {
    const c = ref.current; if (!c) return;
    const cx = c.getContext("2d");
    const W = 800, H = height * 2;
    cx.clearRect(0,0,W,H);
    // water
    cx.fillStyle = C.mapWater; cx.fillRect(0,0,W,H);
    // landmass blobs — abstracted continents
    const land = C.mapBg;
    cx.fillStyle = land;
    // N America
    cx.beginPath();
    cx.moveTo(60, 120); cx.quadraticCurveTo(40, 180, 80, 260); cx.quadraticCurveTo(120, 320, 180, 340); cx.quadraticCurveTo(240, 340, 260, 300); cx.quadraticCurveTo(290, 250, 270, 180); cx.quadraticCurveTo(240, 110, 180, 90); cx.quadraticCurveTo(110, 80, 60, 120);
    cx.fill();
    // S America
    cx.beginPath();
    cx.moveTo(230, 380); cx.quadraticCurveTo(220, 460, 240, 540); cx.quadraticCurveTo(260, 600, 290, 590); cx.quadraticCurveTo(310, 540, 300, 460); cx.quadraticCurveTo(290, 400, 260, 370); cx.quadraticCurveTo(240, 370, 230, 380);
    cx.fill();
    // Europe + Africa
    cx.beginPath();
    cx.moveTo(380, 160); cx.quadraticCurveTo(360, 220, 380, 280); cx.quadraticCurveTo(390, 360, 420, 450); cx.quadraticCurveTo(450, 540, 490, 560); cx.quadraticCurveTo(520, 540, 520, 460); cx.quadraticCurveTo(510, 380, 490, 310); cx.quadraticCurveTo(500, 240, 480, 180); cx.quadraticCurveTo(440, 140, 380, 160);
    cx.fill();
    // Asia
    cx.beginPath();
    cx.moveTo(520, 140); cx.quadraticCurveTo(510, 220, 560, 280); cx.quadraticCurveTo(640, 310, 720, 280); cx.quadraticCurveTo(740, 220, 700, 160); cx.quadraticCurveTo(620, 120, 520, 140);
    cx.fill();
    // Australia
    cx.beginPath();
    cx.moveTo(660, 470); cx.quadraticCurveTo(650, 520, 700, 540); cx.quadraticCurveTo(750, 540, 760, 510); cx.quadraticCurveTo(750, 470, 700, 460); cx.quadraticCurveTo(670, 460, 660, 470);
    cx.fill();

    // Soft grid
    cx.strokeStyle = "rgba(0,0,0,0.045)"; cx.lineWidth = 1;
    for (let i = 1; i < 8; i++) { cx.beginPath(); cx.moveTo(0, H*i/8); cx.lineTo(W, H*i/8); cx.stroke(); }
    for (let i = 1; i < 10; i++) { cx.beginPath(); cx.moveTo(W*i/10, 0); cx.lineTo(W*i/10, H); cx.stroke(); }

    // attribution
    cx.fillStyle = "rgba(0,0,0,0.28)"; cx.font = `9px ${sans}`;
    cx.fillText("Map · Lore Guides", 10, H-10);
  }, [height]);
  return <canvas ref={ref} width={800} height={height * 2} style={{ width: "100%", height, display: "block" }}/>;
}

function Screen_MyPlaces_Map() {
  // Illustrative pin positions — each guide roughly clustered in a region
  // so the "scope of curiosity" reads at a glance.
  const valencia = MY_GUIDES.find(g => g.id === "valencia").color;
  const southfl  = MY_GUIDES.find(g => g.id === "south-fl").color;
  const keys     = MY_GUIDES.find(g => g.id === "keys-2024").color;
  const coffee   = MY_GUIDES.find(g => g.id === "best-coffee").color;
  const unfiled  = C.sage;

  return (
    <Phone height={832} label="My Places · world map">
      <NavBar
        left={<Logo size={11}/>}
        center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>My Places</span>}
        right={<Icon path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} size={15} color={C.faint}/>}
      />

      {/* View toggle — sits under nav bar */}
      <div style={{ display: "flex", gap: 0, padding: "10px 20px 12px", borderBottom: `1px solid ${C.border}`, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>List</span>
          <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 2 }}>Map</span>
        </div>
        <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" }}>{MY_PLACES.length} places</span>
      </div>

      {/* Guide filter strip */}
      <div style={{ padding: "10px 14px", display: "flex", gap: 6, overflowX: "auto", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
        <span style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", background: C.ink, color: C.bg, borderRadius: 999, whiteSpace: "nowrap" }}>All</span>
        {MY_GUIDES.map(g => (
          <span key={g.id} style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", border: `1px solid ${C.border}`, color: C.inkMuted, borderRadius: 999, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: g.color }}/>
            {g.title}
          </span>
        ))}
        <span style={{ fontFamily: serif, fontSize: 11, padding: "3px 10px", border: `1px solid ${C.border}`, color: C.inkMuted, borderRadius: 999, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: unfiled }}/>
          Unfiled
        </span>
      </div>

      {/* Map canvas with pin overlay */}
      <div style={{ position: "relative" }}>
        <WorldCanvas height={440}/>

        {/* Pins — clusters for dense regions, singles elsewhere */}
        <MapPinCluster count={3} x={22} y={48} active={false}/>  {/* SF / west coast */}
        <MapPinCluster count={17} x={30} y={60} active={true}/>  {/* South Florida + Keys */}
        <MapPinOne color={keys}     x={26} y={62}/>
        <MapPinOne color={unfiled}  x={33} y={58}/>
        <MapPinCluster count={7} x={49} y={42} active={false}/>  {/* Valencia */}
        <MapPinOne color={valencia} x={47} y={44}/>
        <MapPinCluster count={11} x={52} y={47} active={false}/> {/* Lisbon */}
        <MapPinOne color={coffee}   x={58} y={52}/>
        <MapPinOne color={unfiled}  x={82} y={42}/>             {/* Tokyo (Sarah's Golden Gai) */}

        {/* Peek card — pinned to cluster over FL/Keys (active) */}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, background: C.bg, border: `1px solid ${C.borderBold}`, borderRadius: 4, padding: "12px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.accent }}>South Florida + Keys</span>
            <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" }}>17 places</span>
          </div>
          <p style={{ fontFamily: serif, fontSize: 13, color: C.inkMuted, fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.55 }}>
            Tap a pin to see the place. Zoom in to break apart the cluster.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: serif, fontSize: 11, color: C.inkMuted }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: southfl }}/> South Florida · 14
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: serif, fontSize: 11, color: C.inkMuted }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: keys }}/> Keys trip · 8
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: serif, fontSize: 11, color: C.inkMuted }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: unfiled }}/> 3 unfiled
            </span>
          </div>
        </div>

        {/* Zoom controls */}
        <div style={{ position: "absolute", top: 16, right: 16, background: C.bg, border: `1px solid ${C.borderBold}`, borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.inkMuted, cursor: "pointer" }}><Icon path={Paths.plus} size={12} color="currentColor"/></div>
          <div style={{ padding: "6px 8px", color: C.inkMuted, cursor: "pointer" }}><Icon path={<line x1="5" y1="12" x2="19" y2="12"/>} size={12} color="currentColor"/></div>
        </div>

        {/* Locate-me */}
        <div style={{ position: "absolute", top: 70, right: 16, background: C.bg, border: `1px solid ${C.borderBold}`, borderRadius: 4, padding: "6px 8px", color: C.accent, cursor: "pointer" }}>
          <Icon path={<><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></>} size={12} color="currentColor"/>
        </div>
      </div>
    </Phone>
  );
}

// Peek variant — a single pin selected, peek card shows the place itself.
function Screen_MyPlaces_Map_PlacePeek() {
  const p = MY_PLACES.find(x => x.name === "The Anchor");
  return (
    <Phone height={832} label="My Places · map · place peek">
      <NavBar
        left={<Logo size={11}/>}
        center={<span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>My Places</span>}
        right={<Icon path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} size={15} color={C.faint}/>}
      />
      <div style={{ display: "flex", gap: 0, padding: "10px 20px 12px", borderBottom: `1px solid ${C.border}`, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.faint }}>List</span>
          <span style={{ fontFamily: serif, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ink, borderBottom: `1px solid ${C.ink}`, paddingBottom: 2 }}>Map</span>
        </div>
        <span style={{ fontFamily: serif, fontSize: 11, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" }}>Zoomed · FL</span>
      </div>

      <div style={{ position: "relative" }}>
        <WorldCanvas height={440}/>
        {/* Zoomed view — a few individual pins in FL */}
        <MapPinOne color={C.sage}   x={38} y={28} waymark={true}/>
        <MapPinOne color={C.sage}   x={46} y={40} active={true} waymark={true}/>
        <MapPinOne color={MY_GUIDES.find(g => g.id === "south-fl").color} x={30} y={54}/>
        <MapPinOne color={MY_GUIDES.find(g => g.id === "keys-2024").color} x={54} y={68}/>
        <MapPinOne color={MY_GUIDES.find(g => g.id === "keys-2024").color} x={62} y={74}/>

        {/* Peek card for a single place */}
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, background: C.bg, border: `1px solid ${C.borderBold}`, borderRadius: 4, padding: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", overflow: "hidden", display: "flex" }}>
          <div style={{ width: 86, background: p.color, flexShrink: 0, filter: "saturate(0.78)" }}/>
          <div style={{ flex: 1, padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
              <span style={{ fontFamily: serif, fontSize: 15, color: C.ink, letterSpacing: "-0.005em" }}>{p.name}</span>
              <span style={{ fontFamily: serif, fontSize: 10, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" }}>{p.type}</span>
            </div>
            <div style={{ fontFamily: serif, fontSize: 11, color: C.faint, fontStyle: "italic", marginBottom: 6 }}>{p.nbhd}</div>
            <p style={{ fontFamily: serif, fontSize: 12, color: C.inkMuted, lineHeight: 1.5, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>"{p.note}"</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: serif, fontSize: 10, color: C.draftText, background: C.draftBg, border: `1px solid ${C.draftBorder}`, padding: "1px 6px", borderRadius: 2, letterSpacing: "0.08em", textTransform: "uppercase" }}>Unfiled</span>
              <span style={{ fontFamily: serif, fontSize: 10, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Open</span>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  Screen_OnbV2_FirstPlace,
  Screen_Capture_Sheet, Screen_Capture_GuidePicker,
  Screen_MyPlaces_All, Screen_MyPlaces_Unfiled, Screen_MyPlaces_Detail,
  Screen_MyPlaces_Map, Screen_MyPlaces_Map_PlacePeek,
  Screen_NewGuide_V2_TypePicker, Screen_NewGuide_V2_Theme,
  Screen_Home_V2, Screen_Home_V2_GuidesTab, Screen_Home_Empty,
});
