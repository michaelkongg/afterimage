"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "home" | "setup" | "feed" | "recall" | "recognition" | "results" | "tomorrow";
type Topic = "Ideas" | "Science" | "Culture" | "Sport";

type Item = {
  id: number;
  topic: Topic;
  format: "WATCH" | "READ" | "LOOK";
  source: string;
  readTime: string;
  title: string;
  body: string;
  kicker: string;
  keywords: string[];
  color: string;
};

const library: Item[] = [
  { id: 1, topic: "Ideas", format: "READ", source: "The Learning Lab", readTime: "42 sec", title: "Memory is strengthened by retrieval, not rereading.", body: "Trying to pull an idea from memory changes the memory itself. Even an imperfect attempt can create a stronger path back to it than another passive reread.", kicker: "The struggle to remember is part of remembering.", keywords: ["retrieval", "rereading", "remember", "memory", "struggle"], color: "#ff624d" },
  { id: 2, topic: "Science", format: "WATCH", source: "Field Notes", readTime: "31 sec", title: "An octopus does not think only with its head.", body: "A large share of an octopus’s neurons are distributed through its arms. Each arm can process touch and coordinate movement while still working with the central brain.", kicker: "Intelligence can be distributed.", keywords: ["octopus", "neurons", "arms", "distributed", "brain"], color: "#75b8ff" },
  { id: 3, topic: "Culture", format: "LOOK", source: "Contact Sheet", readTime: "24 sec", title: "A photograph can preserve context—or remove it.", body: "Cropping does more than improve composition. It decides which relationships, witnesses, and contradictions remain inside the frame.", kicker: "Every frame is also an exclusion.", keywords: ["photograph", "photo", "crop", "cropping", "frame", "context"], color: "#d0a7ff" },
  { id: 4, topic: "Sport", format: "WATCH", source: "Baseline", readTime: "36 sec", title: "Topspin is not simply hitting upward.", body: "The racket brushes up and across the ball, producing rotation. The resulting pressure difference helps the ball dip sooner, letting a player swing harder while keeping it inside the court.", kicker: "More spin creates room for more speed.", keywords: ["topspin", "tennis", "rotation", "ball", "dip", "racket"], color: "#d8ff62" },
  { id: 5, topic: "Ideas", format: "READ", source: "Margin", readTime: "39 sec", title: "A city feels safer when its streets are watched informally.", body: "Jane Jacobs described “eyes on the street”: ordinary people in shops, windows, and sidewalks creating a kind of shared awareness that formal surveillance cannot fully replace.", kicker: "Attention can be civic infrastructure.", keywords: ["jane", "jacobs", "eyes", "street", "city", "safety"], color: "#ffc25a" },
  { id: 6, topic: "Science", format: "LOOK", source: "Deep Time", readTime: "28 sec", title: "Voyager carries a message for no guaranteed recipient.", body: "The Golden Record contains sounds, images, music, and greetings from Earth. Its value may not depend on being found; making it required humanity to decide how it wanted to be remembered.", kicker: "A memory made for the universe.", keywords: ["voyager", "golden", "record", "earth", "sounds", "remembered"], color: "#83ddc3" },
  { id: 7, topic: "Culture", format: "READ", source: "Material Memory", readTime: "33 sec", title: "Kintsugi does not hide where an object broke.", body: "The repair remains visible, often emphasized with metallic lacquer. The object’s history is not treated as visual noise to erase, but as part of its continuing form.", kicker: "Repair can become part of the record.", keywords: ["kintsugi", "repair", "broken", "gold", "lacquer", "history"], color: "#ff9dcf" },
  { id: 8, topic: "Sport", format: "LOOK", source: "The Long Rally", readTime: "27 sec", title: "The score hides the shape of a tennis match.", body: "Two players can win the same number of points while one wins the match. Points are nested inside games and sets, so timing and concentration matter alongside total output.", kicker: "Not every point has equal consequence.", keywords: ["tennis", "points", "games", "sets", "score", "match"], color: "#a9c8ff" },
  { id: 9, topic: "Ideas", format: "WATCH", source: "Small Systems", readTime: "35 sec", title: "Convenience changes what we consider worth remembering.", body: "When information always feels retrievable, we may remember where to find it rather than the information itself. Access becomes a substitute for possession.", kicker: "Knowing where is not the same as knowing.", keywords: ["access", "find", "information", "remember", "knowing", "retrievable"], color: "#ff8b6f" },
  { id: 10, topic: "Science", format: "READ", source: "Night School", readTime: "41 sec", title: "Sleep is not empty time for memory.", body: "During sleep, recently formed memories can be reorganized and stabilized. Learning continues after the book closes, without another conscious repetition.", kicker: "Rest is part of the work.", keywords: ["sleep", "memory", "learning", "rest", "stabilized"], color: "#9ea5ff" },
  { id: 11, topic: "Culture", format: "WATCH", source: "Signal / Noise", readTime: "30 sec", title: "Repetition can create familiarity without understanding.", body: "A sentence seen many times may begin to feel true or known even when we cannot explain it. Recognition is easier than reconstructing an idea unaided.", kicker: "Familiar is not the same as understood.", keywords: ["repetition", "familiarity", "familiar", "recognition", "understanding", "true"], color: "#e8b876" },
  { id: 12, topic: "Sport", format: "READ", source: "Between Points", readTime: "32 sec", title: "Elite players build rituals between points.", body: "The pause is not dead time. A consistent routine can interrupt the previous point, regulate emotion, and narrow attention to the next decision.", kicker: "Resetting is a competitive skill.", keywords: ["players", "ritual", "routine", "point", "emotion", "reset"], color: "#bbdf84" },
];

const topics: Topic[] = ["Ideas", "Science", "Culture", "Sport"];

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Go to Afterimage home"><span>AFTER</span><i>IMAGE</i></button>;
}

function Shell({ children, phase, goHome }: { children: React.ReactNode; phase: string; goHome: () => void }) {
  return <main className="app-shell"><nav><Logo onClick={goHome}/><span className="nav-note">{phase}</span><span className="local-pill">● ON-DEVICE</span></nav>{children}</main>;
}

export default function AfterimageGame() {
  const [phase, setPhase] = useState<Phase>("home");
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(["Ideas", "Science"]);
  const [session, setSession] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<number[]>([]);
  const [recall, setRecall] = useState("");
  const [remembered, setRemembered] = useState<number[]>([]);
  const [decoy, setDecoy] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (localStorage.getItem("afterimage-latest")) setDueCount(1);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleTopic = (topic: Topic) => {
    setSelectedTopics((old) => old.includes(topic) ? (old.length > 1 ? old.filter(t => t !== topic) : old) : [...old, topic].slice(-3));
  };

  const startSession = () => {
    const chosen = selectedTopics.flatMap(topic => library.filter(item => item.topic === topic).slice(0, 2));
    setSession(chosen);
    setIndex(0);
    setSeen([chosen[0].id]);
    setRecall("");
    setRemembered([]);
    setDecoy("");
    startedAt.current = Date.now();
    setPhase("feed");
  };

  const nextItem = () => {
    if (index === session.length - 1) {
      setElapsed(Math.max(1, Math.round((Date.now() - startedAt.current) / 60000)));
      setPhase("recall");
      return;
    }
    const next = index + 1;
    setIndex(next);
    setSeen(old => [...new Set([...old, session[next].id])]);
  };

  const recallMatches = useMemo(() => {
    const value = recall.toLowerCase();
    return session.filter(item => item.keywords.some(keyword => value.includes(keyword)));
  }, [recall, session]);

  const accurate = useMemo(() => new Set([...recallMatches.map(i => i.id), ...remembered]).size, [recallMatches, remembered]);
  const score = session.length ? Math.round((accurate / session.length) * 100) : 0;

  const finish = () => {
    localStorage.setItem("afterimage-latest", JSON.stringify({
      createdAt: Date.now(),
      items: session,
      recall,
      remembered,
      score,
    }));
    setDueCount(1);
    setPhase("results");
  };

  const loadTomorrow = () => {
    const saved = localStorage.getItem("afterimage-latest");
    if (saved) {
      const data = JSON.parse(saved);
      setSession(data.items);
      setRemembered([]);
      setRecall("");
    }
    setPhase("tomorrow");
  };

  const goHome = () => { setPhase("home"); window.scrollTo({ top: 0 }); };

  if (phase === "home") return (
    <main className="new-home">
      <nav><Logo onClick={goHome}/><span className="nav-note">IDEAS RETAINED, NOT TIME SPENT</span><button className="text-link" onClick={() => setPhase("setup")}>Start a session ↗</button></nav>
      <section className="home-hero">
        <p className="eyebrow coral-text">WHAT ACTUALLY DESERVES TO BE REMEMBERED?</p>
        <h1>You consumed it.<br/><em>Did it become yours?</em></h1>
        <p>Stop renting ideas for a few seconds. Afterimage is a feed measured by what remains—not how long it can keep you scrolling.</p>
        <div className="home-actions"><button className="primary" onClick={() => setPhase("setup")}><span>Begin a 3-minute session</span><b>→</b></button>{dueCount > 0 && <button className="due-button" onClick={loadTomorrow}><strong>1</strong><span>afterimage ready<br/><small>Check what survived</small></span></button>}</div>
      </section>
      <aside className="receipt-preview">
        <div className="receipt-head"><span>AFTERIMAGE / SAMPLE</span><span>03:12</span></div>
        <div className="receipt-big"><strong>8</strong><span>ideas<br/>entered</span></div>
        <div className="receipt-big coral-text"><strong>3</strong><span>remained<br/>unaided</span></div>
        <div className="receipt-line"><span>Retention per minute</span><b>0.94</b></div>
        <div className="receipt-line"><span>Strongest trace</span><b>Ideas</b></div>
        <p>Screen time tells you how long you looked. This tells you what stayed.</p>
      </aside>
      <footer><span>An internet designed to leave an afterimage, not maximize another swipe.</span><span>PRIVATE BY DEFAULT</span></footer>
    </main>
  );

  if (phase === "setup") return (
    <Shell phase="01 / INTENTION" goHome={goHome}>
      <section className="setup-panel">
        <div className="setup-copy"><p className="eyebrow coral-text">BEFORE YOU CONSUME</p><h2>What do you want<br/>to leave with?</h2><p>Choose up to three threads. Afterimage will give you a short, finite mix—not an endless feed.</p></div>
        <div className="topic-picker">
          <p className="picker-label">SELECT YOUR THREADS <span>{selectedTopics.length}/3</span></p>
          {topics.map((topic, i) => <button key={topic} className={selectedTopics.includes(topic) ? "active" : ""} onClick={() => toggleTopic(topic)}><span>0{i + 1}</span><b>{topic}</b><i>{selectedTopics.includes(topic) ? "●" : "○"}</i></button>)}
          <div className="session-contract"><span>YOUR SESSION</span><div><b>{selectedTopics.length * 2}</b><small>pieces</small></div><div><b>~3</b><small>minutes</small></div><div><b>1</b><small>reflection</small></div></div>
          <button className="primary wide" onClick={startSession}><span>Enter with intention</span><b>→</b></button>
        </div>
      </section>
    </Shell>
  );

  if (phase === "feed") {
    const item = session[index];
    return (
      <main className="consume-page" style={{ "--accent": item.color } as React.CSSProperties}>
        <nav><Logo onClick={goHome}/><span className="session-progress">{String(index + 1).padStart(2, "0")} <i>/ {String(session.length).padStart(2, "0")}</i></span><button className="quiet-exit" onClick={() => setPhase("recall")}>End session</button></nav>
        <div className="progress-track"><i style={{ width: `${((index + 1) / session.length) * 100}%` }}/></div>
        <article className="content-card">
          <header className="content-meta"><span>{item.format}</span><span>{item.topic}</span><span>{item.readTime}</span></header>
          <div className="content-visual"><small>{item.source}</small><strong>{item.title}</strong><div className="orb"/><span className="visual-number">{String(item.id).padStart(2, "0")}</span></div>
          <div className="content-copy"><p>{item.body}</p><blockquote>{item.kicker}</blockquote></div>
        </article>
        <div className="feed-controls"><button className="save-trace" onClick={() => setRemembered(old => old.includes(item.id) ? old.filter(id => id !== item.id) : [...old, item.id])}>{remembered.includes(item.id) ? "◆ Marked meaningful" : "◇ Mark this meaningful"}</button><button className="next-content" onClick={nextItem}>{index === session.length - 1 ? "Let the feed dissolve" : "Next idea"} <b>→</b></button></div>
        <p className="finite-note">A finite feed. There is an end.</p>
      </main>
    );
  }

  if (phase === "recall") return (
    <Shell phase="02 / RETRIEVAL" goHome={goHome}>
      <section className="recall-new">
        <div><p className="eyebrow coral-text">THE FEED IS GONE</p><h2>What remained<br/>without prompting?</h2><p>Do not make it polished. Fragments, feelings, phrases, and half-formed ideas all count.</p></div>
        <div className="recall-input">
          <textarea autoFocus value={recall} onChange={e => setRecall(e.target.value)} placeholder="I remember something about…" />
          <div><span>{recall.trim() ? recall.trim().split(/\s+/).length : 0} words</span><span>Your first recall is the most honest one.</span></div>
          <button disabled={recall.trim().length < 12} className="primary wide" onClick={() => setPhase("recognition")}><span>See what else feels familiar</span><b>→</b></button>
        </div>
      </section>
    </Shell>
  );

  if (phase === "recognition") return (
    <Shell phase="03 / RECOGNITION" goHome={goHome}>
      <section className="recognition">
        <p className="eyebrow coral-text">RECALL ≠ RECOGNITION</p>
        <h2>Which ideas do you recognize?</h2>
        <p>Recognition is easier than producing an idea unaided. Select everything you genuinely remember seeing.</p>
        <div className="recognition-grid">
          {[...session.map(item => ({ id: String(item.id), title: item.title })), { id: "decoy", title: "Novelty is always more memorable than meaning." }].sort((a,b) => a.id.localeCompare(b.id)).map(card => {
            const selected = card.id === "decoy" ? decoy === "decoy" : remembered.includes(Number(card.id));
            return <button key={card.id} className={selected ? "selected" : ""} onClick={() => card.id === "decoy" ? setDecoy(decoy ? "" : "decoy") : setRemembered(old => old.includes(Number(card.id)) ? old.filter(id => id !== Number(card.id)) : [...old, Number(card.id)])}><i>{selected ? "●" : "○"}</i><span>{card.title}</span></button>;
          })}
        </div>
        <button className="primary" onClick={finish}><span>Reveal my attention receipt</span><b>→</b></button>
      </section>
    </Shell>
  );

  if (phase === "tomorrow") return (
    <Shell phase="24H / AFTERIMAGE" goHome={goHome}>
      <section className="tomorrow">
        <p className="eyebrow coral-text">NO FEED. NO CLUES.</p>
        <h2>What survived?</h2>
        <p>Yesterday you encountered {session.length} ideas. Before seeing them again, write down whatever is still accessible.</p>
        <textarea autoFocus value={recall} onChange={e => setRecall(e.target.value)} placeholder="A day later, I still remember…" />
        <button className="primary" disabled={recall.trim().length < 8} onClick={() => setPhase("results")}><span>Compare with yesterday</span><b>→</b></button>
      </section>
    </Shell>
  );

  return (
    <main className="receipt-page">
      <nav><Logo onClick={goHome}/><span className="nav-note">YOUR ATTENTION RECEIPT</span><button className="text-link" onClick={goHome}>Done ×</button></nav>
      <section className="result-hero">
        <div className="retention-mark"><strong>{score}%</strong><span>RETAINED<br/>TODAY</span></div>
        <div><p className="eyebrow coral-text">{score >= 50 ? "A CLEAR AFTERIMAGE" : "A FADING AFTERIMAGE"}</p><h2>{accurate} of {session.length} ideas remained.</h2><p>You spent roughly {elapsed || 3} minute{elapsed === 1 ? "" : "s"} with this session. {recallMatches.length} idea{recallMatches.length === 1 ? "" : "s"} appeared in your unprompted recall; the rest surfaced only when you saw them again.</p></div>
      </section>
      <section className="metric-strip">
        <article><small>VIEWED</small><b>{seen.length || session.length}</b><p>finite pieces</p></article>
        <article><small>RECALLED UNAIDED</small><b>{recallMatches.length}</b><p>strongest traces</p></article>
        <article><small>RECOGNIZED</small><b>{remembered.length}</b><p>after prompting</p></article>
        <article><small>MEMORY / MINUTE</small><b>{((accurate || 0) / (elapsed || 3)).toFixed(1)}</b><p>ideas retained</p></article>
      </section>
      <section className="trace-section">
        <div><p className="eyebrow">YOUR STRONGEST TRACES</p><h3>What became yours.</h3></div>
        <div className="trace-list">
          {session.map(item => {
            const free = recallMatches.some(match => match.id === item.id);
            const recognized = remembered.includes(item.id);
            return <article key={item.id} className={free ? "strong" : recognized ? "familiar" : "faded"}><span>{free ? "REMEMBERED" : recognized ? "RECOGNIZED" : "FADED"}</span><b>{item.title}</b><i>{free ? "●" : recognized ? "◐" : "○"}</i></article>;
          })}
        </div>
      </section>
      <section className="tomorrow-callout"><div><p className="eyebrow coral-text">THE REAL TEST IS LATER</p><h3>Come back tomorrow.<br/>See what actually stayed.</h3><p>This session is saved only on this device. Afterimage will ask once—before showing you any answers.</p></div><button className="tomorrow-ticket" onClick={loadTomorrow}><span>24H CHECK-IN</span><strong>Tomorrow</strong><small>Preview the spaced recall now →</small></button></section>
      <section className="closing"><p>Your time online should leave more than a timestamp.</p><h2>Keep one idea. Lose the noise.</h2><button className="primary" onClick={() => setPhase("setup")}><span>Start another finite session</span><b>→</b></button></section>
    </main>
  );
}
