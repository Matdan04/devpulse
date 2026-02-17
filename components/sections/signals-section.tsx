const signals = [
  {
    icon: "🌙",
    title: "Late-Night Commits",
    description:
      "Tracks commits after 10pm in the developer\u2019s local timezone. Occasional late nights are normal but sustained patterns aren\u2019t.",
  },
  {
    icon: "📅",
    title: "Weekend Pushes",
    description:
      "Monitors Saturday and Sunday activity. Compares against each developer\u2019s personal baseline to avoid false positives.",
  },
  {
    icon: "👀",
    title: "PR Review Drop",
    description:
      "A sudden decline in code review participation often signals overwhelm or disengagement both early burnout indicators.",
  },
  {
    icon: "📊",
    title: "Issue Overload",
    description:
      "Ratio of assigned vs. completed issues, plus overdue count. High load with low throughput flags unsustainable workloads.",
  },
  {
    icon: "⚡",
    title: "Velocity Changes",
    description:
      "Both sharp increases and decreases matter. Crunch mode is just as concerning as sudden slowdowns.",
  },
  {
    icon: "🔀",
    title: "Pattern Disruption",
    description:
      "Irregularity in working hours, wide variance in start/end times suggests disrupted routines and poor recovery.",
  },
];

export default function SignalsSection() {
  return (
    <section className="signals-section" id="signals">
      <div className="section-label">Behavioral Signals</div>
      <h2 className="section-title">Six signals. Zero surveillance.</h2>
      <p className="section-desc">
        DevPulse tracks work patterns not keystrokes, not screen time, not
        code quality. Just the behavioral signals that research shows correlate
        with burnout.
      </p>

      <div className="signals-grid">
        {signals.map((signal) => (
          <div key={signal.title} className="signal-card">
            <div className="signal-icon">{signal.icon}</div>
            <h3>{signal.title}</h3>
            <p>{signal.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
