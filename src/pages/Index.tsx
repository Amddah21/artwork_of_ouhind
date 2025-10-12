import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Exhibitions from "@/components/Exhibitions";
import CommerceContact from "@/components/CommerceContact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Portfolio />
      <About />
      <Exhibitions />
      <CommerceContact />
    </div>
  );
};

export default Index;
