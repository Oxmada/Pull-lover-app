'use client';
import AproposSection from "./components/AproposSection";
import NotreCollectionSection from "./components/NotreCollectionSection";
import ProcessSection from "./components/ProcessSection";
import LifeStyleSection from "./components/LifeStyleSection";
import ValuesNewsletterSection from "./components/ValuesNewsletterSection";
import "./home.css";

export default function HomePage() {
  return (
    <main className="home-pro">
      <AproposSection />
      <NotreCollectionSection />
      <ProcessSection />
      <LifeStyleSection />
      <ValuesNewsletterSection />
    </main>
  );
}
