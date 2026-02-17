import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EkgLine from "@/components/ekg-line";

export default function HeroSection() {
  return (
    <section className="hero">
      <Badge variant="outline" className="badge">
        Now in Beta — Open Source
      </Badge>
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
        <Button asChild className="btn-primary">
          <a href="#">Get Started Free</a>
        </Button>
        <Button asChild variant="outline" className="btn-secondary">
          <a href="#">View on GitHub →</a>
        </Button>
      </div>

      <EkgLine />
    </section>
  );
}
