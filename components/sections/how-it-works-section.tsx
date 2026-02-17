const steps = [
  {
    number: 1,
    title: "Connect GitHub",
    description:
      "OAuth in, select repos. We read commits, PRs, and issues. Never code content.",
  },
  {
    number: 2,
    title: "Invite Team",
    description:
      "Members set their timezone and privacy preferences. Each person owns their data.",
  },
  {
    number: 3,
    title: "Build Baseline",
    description:
      "7 days of data creates a personal baseline. No generic thresholds — everything is relative.",
  },
  {
    number: 4,
    title: "Get Insights",
    description:
      "Team dashboard, individual deep-dives, Slack alerts, and weekly reports — all privacy-first.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="how-section" id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">Setup in 5 minutes</h2>
      <p className="section-desc">
        Connect your tools, invite your team, and let DevPulse build a
        behavioral baseline. First insights in 7 days.
      </p>

      <div className="steps">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
