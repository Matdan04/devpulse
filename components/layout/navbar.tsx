import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
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
          <Button asChild className="btn-primary">
            <a href="#">Get Early Access</a>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
