import LandingNavbar from '../components/landing/LandingNavbar.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import ProductFlow from '../components/landing/ProductFlow.jsx';
import AudienceSection from '../components/landing/AudienceSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import DeviceSection from '../components/landing/DeviceSection.jsx';
import AnalyticsSection from '../components/landing/AnalyticsSection.jsx';
import ComparisonSection from '../components/landing/ComparisonSection.jsx';
import UseCasesSection from '../components/landing/UseCasesSection.jsx';
import MonetizationSection from '../components/landing/MonetizationSection.jsx';
import SecuritySection from '../components/landing/SecuritySection.jsx';
import FAQSection from '../components/landing/FAQSection.jsx';
import AppDownloadSection from '../components/landing/AppDownloadSection.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';

export default function Landing() {
  return (
    <div className="landing-page min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <ProductFlow />
        <AudienceSection />
        <FeaturesSection />
        <HowItWorks />
        <DeviceSection />
        <AnalyticsSection />
        <ComparisonSection />
        <UseCasesSection />
        <MonetizationSection />
        <SecuritySection />
        <FAQSection />
        <AppDownloadSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
