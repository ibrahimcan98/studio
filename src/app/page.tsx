// Force fresh deploy to clear edge cache - 2026-03-22
import Hero from '@/components/sections/hero';
import WhyUs from '@/components/sections/why-us';
import HowItWorks from '@/components/sections/how-it-works';
import MapJourney from '@/components/sections/map-journey';
import Testimonials from '@/components/sections/testimonials';
import Faq from '@/components/sections/faq';
import Footer from '@/components/layout/footer';
import { AuthActionRedirect } from '@/components/auth/auth-action-redirect';

export default function Home() {
  return (
    <>
      <AuthActionRedirect />
      <Hero />
      <WhyUs />
      <HowItWorks />
      <MapJourney />
      <Testimonials />
      <Faq />
      <Footer />
    </>
  );
}
