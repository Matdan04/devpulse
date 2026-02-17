export default function Home() {
  return (
    <>
      {/* Ambient Glow */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="ambient-glow glow-3" />

      {/* Navigation */}
      <nav>
        <div className="logo">
          <div className="logo-icon">
            <div className="pulse-ring" />
            <div className="pulse-dot" />
          </div>
          DevPulse
        </div>
        <ul className="nav-links">
          <li>
            <a href="#signals">Signals</a>
          </li>
          <li>
            <a href="#how">How It Works</a>
          </li>
          <li>
            <a href="#privacy">Privacy</a>
          </li>
          <li>
            <a href="#" className="btn-primary">
              Get Early Access
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="badge">Now in Beta — Open Source</div>
        <h1>
          Detect developer
          <br />
          <span className="highlight">burnout before</span>
          <br />
          it happens
        </h1>
        <p>
          DevPulse monitors behavioral signals from your Git repos and issue
          trackers to surface burnout risk early — not emotionally, but
          objectively.
        </p>
        <div className="hero-buttons">
          <a href="#" className="btn-primary">
            Get Started Free
          </a>
          <a href="#" className="btn-secondary">
            View on GitHub →
          </a>
        </div>

        <div className="ekg-container">
          <svg
            width="100%"
            height="80"
            viewBox="0 0 900 80"
            preserveAspectRatio="none"
          >
            <path
              className="ekg-line-bg"
              d="M0,40 L150,40 L180,40 L200,15 L220,65 L240,25 L260,55 L280,40 L450,40 L480,40 L500,10 L520,70 L540,20 L560,60 L580,40 L750,40 L780,40 L800,18 L820,62 L840,30 L860,50 L880,40 L900,40"
            />
            <path
              className="ekg-line"
              d="M0,40 L150,40 L180,40 L200,15 L220,65 L240,25 L260,55 L280,40 L450,40 L480,40 L500,10 L520,70 L540,20 L560,60 L580,40 L750,40 L780,40 L800,18 L820,62 L840,30 L860,50 L880,40 L900,40"
            />
          </svg>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="preview-section">
        <div className="dashboard-preview">
          <div className="preview-topbar">
            <div className="preview-dot r" />
            <div className="preview-dot y" />
            <div className="preview-dot g" />
            <div className="preview-title">devpulse — team dashboard</div>
          </div>
          <div className="preview-body">
            <div className="stat-card">
              <div className="stat-label">Team Health Score</div>
              <div className="stat-value green">38</div>
              <div className="stat-trend down">↓ 4 pts from last week</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">At-Risk Members</div>
              <div className="stat-value yellow">2</div>
              <div className="stat-trend up">↑ 1 from last week</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">After-Hours Commits</div>
              <div className="stat-value red">34%</div>
              <div className="stat-trend up">↑ 12% this sprint</div>
            </div>

            <div className="preview-team">
              <div className="team-row header">
                <span>Member</span>
                <span>Score</span>
                <span>Risk</span>
                <span>Trend (7d)</span>
                <span>Top Signal</span>
              </div>

              {/* Alice K. */}
              <div className="team-row">
                <div className="team-member">
                  <div className="avatar" style={{ background: "#22c55e" }}>
                    AK
                  </div>
                  <span>Alice K.</span>
                </div>
                <span>23</span>
                <span className="risk-badge low">● Low</span>
                <div>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{ width: "23%", background: "var(--green)" }}
                    />
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)" }}>—</span>
              </div>

              {/* Bob M. */}
              <div className="team-row">
                <div className="team-member">
                  <div className="avatar" style={{ background: "#eab308" }}>
                    BM
                  </div>
                  <span>Bob M.</span>
                </div>
                <span>45</span>
                <span className="risk-badge moderate">● Moderate</span>
                <div>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{ width: "45%", background: "var(--yellow)" }}
                    />
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)" }}>Weekend work</span>
              </div>

              {/* Carol S. */}
              <div className="team-row">
                <div className="team-member">
                  <div className="avatar" style={{ background: "#ef4444" }}>
                    CS
                  </div>
                  <span>Carol S.</span>
                </div>
                <span>71</span>
                <span className="risk-badge high">● High</span>
                <div>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{ width: "71%", background: "var(--red)" }}
                    />
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)" }}>
                  Issue overload
                </span>
              </div>

              {/* Anonymous */}
              <div className="team-row">
                <div className="team-member">
                  <div className="avatar" style={{ background: "#64748b" }}>
                    ?
                  </div>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    Anonymous
                  </span>
                </div>
                <span>38</span>
                <span className="risk-badge moderate">● Moderate</span>
                <div>
                  <div className="mini-bar">
                    <div
                      className="mini-bar-fill"
                      style={{ width: "38%", background: "var(--yellow)" }}
                    />
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)" }}>After-hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signals Section */}
      <section className="signals-section" id="signals">
        <div className="section-label">Behavioral Signals</div>
        <h2 className="section-title">Six signals. Zero surveillance.</h2>
        <p className="section-desc">
          DevPulse tracks work patterns — not keystrokes, not screen time, not
          code quality. Just the behavioral signals that research shows correlate
          with burnout.
        </p>

        <div className="signals-grid">
          <div className="signal-card">
            <div className="signal-icon">🌙</div>
            <h3>Late-Night Commits</h3>
            <p>
              Tracks commits after 10pm in the developer&apos;s local timezone.
              Occasional late nights are normal — sustained patterns
              aren&apos;t.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-icon">📅</div>
            <h3>Weekend Pushes</h3>
            <p>
              Monitors Saturday and Sunday activity. Compares against each
              developer&apos;s personal baseline to avoid false positives.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-icon">👀</div>
            <h3>PR Review Drop</h3>
            <p>
              A sudden decline in code review participation often signals
              overwhelm or disengagement — both early burnout indicators.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-icon">📊</div>
            <h3>Issue Overload</h3>
            <p>
              Ratio of assigned vs. completed issues, plus overdue count. High
              load with low throughput flags unsustainable workloads.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-icon">⚡</div>
            <h3>Velocity Changes</h3>
            <p>
              Both sharp increases and decreases matter. Crunch mode is just as
              concerning as sudden slowdowns.
            </p>
          </div>
          <div className="signal-card">
            <div className="signal-icon">🔀</div>
            <h3>Pattern Disruption</h3>
            <p>
              Irregularity in working hours — wide variance in start/end times
              suggests disrupted routines and poor recovery.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section" id="how">
        <div className="section-label">How It Works</div>
        <h2 className="section-title">Setup in 5 minutes</h2>
        <p className="section-desc">
          Connect your tools, invite your team, and let DevPulse build a
          behavioral baseline. First insights in 7 days.
        </p>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect GitHub</h3>
            <p>
              OAuth in, select repos. We read commits, PRs, and issues. Never
              code content.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Invite Team</h3>
            <p>
              Members set their timezone and privacy preferences. Each person
              owns their data.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Build Baseline</h3>
            <p>
              7 days of data creates a personal baseline. No generic thresholds
              — everything is relative.
            </p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Insights</h3>
            <p>
              Team dashboard, individual deep-dives, Slack alerts, and weekly
              reports — all privacy-first.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="privacy-section" id="privacy">
        <div className="section-label">Privacy First</div>
        <h2 className="section-title">Built for trust, not surveillance</h2>
        <p className="section-desc">
          If developers feel watched, the tool fails. DevPulse is designed as a
          self-awareness tool first, team tool second.
        </p>

        <div className="privacy-grid">
          <div className="privacy-card">
            <div className="privacy-icon">🔒</div>
            <div>
              <h3>Individual Scores Are Private</h3>
              <p>
                Your score is visible only to you by default. Team leads see
                aggregated, anonymized data unless you opt in to sharing.
              </p>
            </div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">🚫</div>
            <div>
              <h3>No Code Content Ever</h3>
              <p>
                We never read commit messages, diffs, PR descriptions, or issue
                content. Only timestamps and counts.
              </p>
            </div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">📤</div>
            <div>
              <h3>Export &amp; Delete Anytime</h3>
              <p>
                Download all your data as JSON or permanently delete it with one
                click. Full GDPR compliance built in.
              </p>
            </div>
          </div>
          <div className="privacy-card">
            <div className="privacy-icon">👤</div>
            <div>
              <h3>Anonymous Mode</h3>
              <p>
                Team members can appear as &ldquo;Anonymous&rdquo; in team views
                while still benefiting from personal insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-label">Ready?</div>
        <h2>Stop detecting burnout after the damage.</h2>
        <p>Join the beta. Free for teams under 10 developers.</p>
        <div className="cta-buttons">
          <a href="#" className="btn-primary">
            Get Started Free
          </a>
          <a href="#" className="btn-secondary">
            Star on GitHub ⭐
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 DevPulse. Open source under MIT license.</p>
        <ul className="footer-links">
          <li>
            <a href="#">GitHub</a>
          </li>
          <li>
            <a href="#">Docs</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
        </ul>
      </footer>
    </>
  );
}
