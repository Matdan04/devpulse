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
          <div className="flex gap-2">
          <Button asChild className="btn-primary">
            <a href="/login">Login</a>
          </Button>
            <Button asChild className="btn-primary">
              <a href="#">Signup</a>
            </Button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
