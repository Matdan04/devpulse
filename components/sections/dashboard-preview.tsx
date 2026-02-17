export default function DashboardPreview() {
  return (
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
  );
}
