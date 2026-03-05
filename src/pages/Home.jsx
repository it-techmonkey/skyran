import HeroSection from '../components/home/HeroSection';
import FeaturedProperties from '../components/home/FeaturedProperties';
import PropertiesMap from '../components/home/PropertiesMap';
import DevelopersSection from '../components/home/DevelopersSection';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CTASection from '../components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <PropertiesMap />
      <DevelopersSection />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}

