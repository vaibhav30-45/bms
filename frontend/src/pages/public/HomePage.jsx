import { Helmet } from "react-helmet-async";
import HeroSection from "../../components/home/HeroSection";
import FeaturesSection from "../../components/home/FeaturesSection";
import StatsSection from "../../components/home/StatsSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import CtaSection from "../../components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>NexaBank — Smart Banking for Modern India</title>
        <meta
          name="description"
          content="Open savings or current accounts, transfer funds, complete KYC
                       and manage your finances securely with NexaBank."
        />
        <meta property="og:title" content="NexaBank — Smart Banking" />
        <meta
          property="og:description"
          content="Secure digital banking built for India."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}


