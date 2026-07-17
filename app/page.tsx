import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Gallery } from "@/components/sections/Gallery";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { ScrollEffects } from "@/components/ui/ScrollEffects";
import { services, site } from "@/lib/content";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.name,
  url: site.url,
  description: site.description,
  telephone: site.phone,
  email: site.email,
  image: `${site.url}/images/workshop-hero.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "42 Station Road",
    addressLocality: "Solihull",
    postalCode: "B91 3RT",
    addressCountry: "GB",
  },
  openingHours: ["Mo-Fr 08:00-18:00", "Sa 08:00-13:00"],
  areaServed: {
    "@type": "City",
    name: "Solihull",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Garage services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  },
};

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <About />
        <WhyChooseUs />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
