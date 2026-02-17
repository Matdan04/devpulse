const EKG_PATH =
  "M0,40 L150,40 L180,40 L200,15 L220,65 L240,25 L260,55 L280,40 L450,40 L480,40 L500,10 L520,70 L540,20 L560,60 L580,40 L750,40 L780,40 L800,18 L820,62 L840,30 L860,50 L880,40 L900,40";

export default function EkgLine() {
  return (
    <div className="ekg-container">
      <svg
        width="100%"
        height="80"
        viewBox="0 0 900 80"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ekgPulse" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="var(--green)" stopOpacity="0.15" />
            <stop offset="95%" stopColor="var(--green)" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            <animate
              attributeName="x1"
              from="-300"
              to="900"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0"
              to="1200"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <path className="ekg-line-bg" d={EKG_PATH} />
        <path className="ekg-line-pulse" d={EKG_PATH} />
      </svg>
    </div>
  );
}
