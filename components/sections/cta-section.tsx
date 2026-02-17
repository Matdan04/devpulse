import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="section-label">Ready?</div>
      <h2>Stop detecting burnout after the damage.</h2>
      <p>Join the beta. Free for teams under 10 developers.</p>
      <div className="cta-buttons">
        <Button asChild className="btn-primary">
          <a href="#">Get Started Free</a>
        </Button>
        {/* <Button asChild variant="outline" className="btn-secondary">
          <a href="#">Star on GitHub ⭐</a>
        </Button> */}
      </div>
    </section>
  );
}
