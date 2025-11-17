import Hero from '@/components/sections/hero';
import WhyUs from '@/components/sections/why-us';
import HowItWorks from '@/components/sections/how-it-works';
import MapJourney from '@/components/sections/map-journey';
import Pricing from '@/components/sections/pricing';
import Testimonials from '@/components/sections/testimonials';
import Faq from '@/components/sections/faq';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <HowItWorks />
      <MapJourney />
      <Pricing />
      <Testimonials />
      <Faq />
      <Footer />
    </>
  );
}
