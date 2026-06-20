import dynamic from "next/dynamic";
import AproposSection from "./components/AproposSection";
import NotreCollectionSection from "./components/NotreCollectionSection";
import ProcessSection from "./components/ProcessSection";
import LifeStyleSection from "./components/LifeStyleSection";
import ValuesNewsletterSection from "./components/ValuesNewsletterSection";
import "./home.css";

const CounterTime = dynamic(() => import("./components/CounterTime"), { ssr: false });

export default function HomePage() {
  return (
    <main className="home-pro">
      <CounterTime />
      <AproposSection />
      <NotreCollectionSection />
      <ProcessSection />
      <LifeStyleSection />
      <ValuesNewsletterSection />
    </main>
  );
}
