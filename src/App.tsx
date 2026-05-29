import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  CalendarDays,
  Cpu,
  ExternalLink,
  GraduationCap,
  Hammer,
  HouseWifi,
  Laptop,
  MonitorCog,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";

const programs = [
  {
    title: "Computer Fluency",
    detail: "Files, accounts, browsers, shortcuts, safety, and daily confidence.",
    icon: Laptop,
  },
  {
    title: "Build The Machine",
    detail: "Parts, compatibility, assembly, upgrades, and troubleshooting.",
    icon: Cpu,
  },
  {
    title: "Terminal Basics",
    detail: "Folders, commands, editors, scripts, git, and practical shell habits.",
    icon: TerminalSquare,
  },
  {
    title: "First Website",
    detail: "HTML, CSS, deployment, domains, and a real page students can share.",
    icon: MonitorCog,
  },
  {
    title: "AI Foundations",
    detail: "Chatbots, prompting, model limits, research habits, and practical AI-assisted projects.",
    icon: BrainCircuit,
  },
];

const tracks = [
  "Kids and teens starting from zero",
  "Homeschooled students who need a serious technology lane",
  "College students who need practical confidence",
  "Adults who want modern computer literacy",
  "Families setting up a home lab or first PC",
  "Advanced students ready for apps, automation, and AI",
];

const workshopFlow = [
  "Diagnose current comfort level",
  "Choose a project with visible progress",
  "Build together on the student's machine",
  "Leave with notes, files, and next steps",
];

const aiLessons = [
  {
    title: "Use AI without being fooled by it",
    detail: "Students learn how prompts work, how to verify answers, and when not to trust a model.",
    icon: ShieldCheck,
  },
  {
    title: "Build with AI as a tool",
    detail: "We use AI to plan websites, explain code, debug errors, and turn ideas into working prototypes.",
    icon: Bot,
  },
  {
    title: "Understand what AI is doing",
    detail: "Age-appropriate lessons cover tokens, training data, pattern matching, privacy, and bias.",
    icon: BrainCircuit,
  },
];

const homeschoolPoints = [
  "Semester-friendly technology projects that can become portfolio work",
  "Flexible pace for younger kids, teens, siblings, or mixed-skill families",
  "Computer building, web publishing, coding, AI literacy, and safe research habits",
  "Parent-visible notes, suggested practice, and clear next steps after each session",
];

function HazyForgeLogo() {
  return (
    <svg
      aria-label="Hazy Forge"
      className="brand-mark"
      viewBox="0 0 160 99.2"
      role="img"
    >
      <defs>
        <linearGradient id="forge-gradient" x1="34" x2="158" y1="78" y2="13">
          <stop stopColor="#3786f7" />
          <stop offset="0.5" stopColor="#50d8fa" />
          <stop offset="1" stopColor="#e9fdff" />
        </linearGradient>
      </defs>
      <path
        d="m23.5 57.1-9.6 15.8h9.9c2.5 0 6.1-1.6 8.2-5l7.3-10.8h-15.8zm32.2-53.7-21.6 34.1h16.6l21.2-34.7h-16.1l-0.1 0.6zm41.9 9.2c-4.2 0-10.3 2.8-12.7 5.9l-11.2 18.8c-1.2 2.1-4.7 2.8-7.1 2.8h-56l-7.8 14.2 60.6 0.1-22.1 34.4h11.7c4.4 0 7.3-1.7 9.6-5l31.1-52.5c0.9-1.4 4.8-3.9 8-3.9h47.4l8.5-14.8h-60zm-9.9 47.6-21.9 36h12.7l21.9-36h-12.7zm11-17.2-9.1 14.4h36.7c2.2 0 5.9-1.3 7.4-3.6l6.8-10.8h-41.8z"
        fill="url(#forge-gradient)"
      />
    </svg>
  );
}

export default function App() {
  return (
    <main>
      <section className="hero-section">
        <img
          className="hero-image"
          src="/academy-workbench.png"
          alt="Hands-on computer learning workbench with PC parts, laptops, and notebooks"
        />
        <div className="hero-shade" />
        <header className="topbar" aria-label="Primary">
          <a className="brand" href="#top" aria-label="Hazy Forge Academy home">
            <HazyForgeLogo />
            <span>
              <strong>Hazy Forge</strong>
              <small>Academy</small>
            </span>
          </a>
          <nav>
            <a href="#programs">Programs</a>
            <a href="#ai">AI</a>
            <a href="#homeschool">Homeschool</a>
            <a href="#format">Format</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div id="top" className="hero-content">
          <p className="eyebrow">Computer lessons, AI fluency, builds, and programming foundations</p>
          <h1>Hazy Forge Academy</h1>
          <p className="lede">
            Practical technology teaching for students of all ages, from what a
            computer is to building one, using a terminal, learning AI, and
            shipping a first real website.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="https://cal.hazyforge.io/palehazy/30min">
              <CalendarDays size={18} aria-hidden="true" />
              Book a first session
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-action" href="#programs">
              <GraduationCap size={18} aria-hidden="true" />
              See lesson paths
            </a>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Teaching approach">
        {["One-on-one or small group", "Real machines, real projects", "AI taught with judgment"].map(
          (item) => (
            <span key={item}>{item}</span>
          ),
        )}
      </section>

      <section id="programs" className="section programs-section">
        <div className="section-heading">
          <p className="eyebrow">Start concrete, add AI early, then level up</p>
          <h2>Lesson paths that turn curiosity into usable technology skill.</h2>
        </div>
        <div className="program-grid">
          {programs.map(({ title, detail, icon: Icon }) => (
            <article className="program-card" key={title}>
              <Icon size={28} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="ai" className="section ai-section">
        <div className="section-heading">
          <p className="eyebrow">AI belongs in the toolbox</p>
          <h2>Students learn AI as a practical skill, not a magic answer machine.</h2>
        </div>
        <div className="ai-grid">
          {aiLessons.map(({ title, detail, icon: Icon }) => (
            <article className="ai-card" key={title}>
              <Icon size={28} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="format" className="section split-section">
        <div>
          <p className="eyebrow">Who it is for</p>
          <h2>Students, families, and adults who want computers and AI to feel less mysterious.</h2>
          <ul className="check-list">
            {tracks.map((track) => (
              <li key={track}>
                <Sparkles size={16} aria-hidden="true" />
                {track}
              </li>
            ))}
          </ul>
        </div>

        <div className="workshop-panel">
          <div className="panel-header">
            <Hammer size={22} aria-hidden="true" />
            <span>Workshop rhythm</span>
          </div>
          <ol>
            {workshopFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="homeschool" className="section homeschool-section">
        <div className="homeschool-copy">
          <p className="eyebrow">For homeschool families</p>
          <h2>A real technology track for homeschooled kids and teens.</h2>
          <p>
            Hazy Forge Academy can plug into a homeschool rhythm with practical,
            project-based lessons that make computers, coding, and AI feel
            understandable instead of abstract. The goal is not screen time for
            its own sake. It is confidence, safety, useful skill, and work the
            student can actually show.
          </p>
        </div>
        <div className="homeschool-panel">
          <div className="panel-header">
            <HouseWifi size={22} aria-hidden="true" />
            <span>Homeschool fit</span>
          </div>
          <ul className="check-list compact-list">
            {homeschoolPoints.map((point) => (
              <li key={point}>
                <BookOpenCheck size={16} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section advanced-band">
        <div>
          <p className="eyebrow">Room to grow</p>
          <h2>Beyond basics, the track moves into modern software and AI work.</h2>
        </div>
        <p>
          Once the fundamentals are solid, students can graduate into React,
          Python, automation, APIs, AI tooling, agents, Linux servers, and
          deployment, using the same shipping mindset behind Hazy Forge client
          work.
        </p>
      </section>

      <section id="contact" className="section contact-section">
        <div>
          <p className="eyebrow">First step</p>
          <h2>Start with a short fit call.</h2>
          <p>
            Bring the student's age, current comfort level, machine details, and
            one thing they want to build, understand, or learn how to do with AI.
          </p>
        </div>
        <div className="contact-actions">
          <a className="primary-action" href="https://cal.hazyforge.io/palehazy/30min">
            <CalendarDays size={18} aria-hidden="true" />
            Schedule on Cal
            <ExternalLink size={17} aria-hidden="true" />
          </a>
          <a className="secondary-action" href="mailto:contact@hazyforge.io">
            contact@hazyforge.io
          </a>
        </div>
      </section>
    </main>
  );
}
