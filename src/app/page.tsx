import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CoreSolutions from "../components/CoreSolutions";
import WhyChooseUs from "../components/WhyChooseUs";
import MarketReach from "../components/MarketReach";
import TrustSection from "../components/TrustSection";
import PartnersClients from "../components/PartnersClients";
import Footer from "../components/Footer";
import MemberCompany from "./memberCompany/page";


export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CoreSolutions />
      <WhyChooseUs />
      <MarketReach />
      <TrustSection />
      <MemberCompany/>
      <PartnersClients/>
      <Footer/>
    </main>
  );
}