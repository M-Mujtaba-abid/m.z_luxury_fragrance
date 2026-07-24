import SEO from "../../components/ui/SEO";
import Breadcrumb from "../../components/ui/Breadcrumb";
import AboutHero from "../../components/user/about/AboutHero";
import AboutStory from "../../components/user/about/AboutStory";
import AboutValues from "../../components/user/about/AboutValues";
import AboutGallery from "../../components/user/about/AboutGallery";
import AboutCTA from "../../components/user/about/AboutCTA";

const About = () => {
  return (
    <div className="relative min-h-screen bg-luxury-ink overflow-hidden">
      <SEO
        title="About Us"
        description="Discover the story behind M.Z Luxury Fragrance — our heritage, values, and passion for crafting premium, long-lasting perfumes with the finest ingredients."
        canonicalUrl="/about"
      />

      {/* Ambient glow — matches Contact & Privacy pages */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-luxury-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-luxury-gold/5 blur-[100px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "About Us" }]} />

        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutGallery />
        <AboutCTA />
      </div>
    </div>
  );
};

export default About;
