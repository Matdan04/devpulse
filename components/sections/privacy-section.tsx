const privacyFeatures = [
  {
    icon: "🔒",
    title: "Individual Scores Are Private",
    description:
      "Your score is visible only to you by default. Team leads see aggregated, anonymized data unless you opt in to sharing.",
  },
  {
    icon: "🚫",
    title: "No Code Content Ever",
    description:
      "We never read commit messages, diffs, PR descriptions, or issue content. Only timestamps and counts.",
  },
  {
    icon: "📤",
    title: "Export & Delete Anytime",
    description:
      "Download all your data as JSON or permanently delete it with one click. Full GDPR compliance built in.",
  },
  {
    icon: "👤",
    title: "Anonymous Mode",
    description:
      "Team members can appear as \u201CAnonymous\u201D in team views while still benefiting from personal insights.",
  },
];

export default function PrivacySection() {
  return (
    <section className="privacy-section" id="privacy">
      <div className="section-label">Privacy First</div>
      <h2 className="section-title">Built for trust, not surveillance</h2>
      <p className="section-desc">
        If developers feel watched, the tool fails. DevPulse is designed as a
        self-awareness tool first, team tool second.
      </p>

      <div className="privacy-grid">
        {privacyFeatures.map((feature) => (
          <div key={feature.title} className="privacy-card">
            <div className="privacy-icon">{feature.icon}</div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
