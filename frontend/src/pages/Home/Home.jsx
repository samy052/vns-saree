import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import headerBackground from "../../assets/header_backgroung.png";
import FabricStrip from "./FabricStrip/FabricStrip";
import HeroSlider from "./HeroSlider/HeroSlider";
import OfferBand from "./OfferBand/OfferBand";
import "./Home.css";

const WhyChooseUs = lazy(() => import("./WhyChooseUs/WhyChooseUs"));
const PopularSarees = lazy(() => import("./PopularSarees/PopularSarees"));
const BrowseCircles = lazy(() => import("./BrowseCircles/BrowseCircles"));
const NewArrivals = lazy(() => import("./NewArrivals/NewArrivals"));
const OccasionCollections = lazy(() => import("./OccasionCollections/OccasionCollections"));
const ReviewsStory = lazy(() => import("./ReviewsStory/ReviewsStory"));
const FaqSection = lazy(() => import("./FaqSection/FaqSection"));

const DeferredSection = ({ children, id, minHeight = 240, canObserve = false }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isVisible || !canObserve) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80px 0px", threshold: 0.01 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [canObserve, isVisible]);

  return (
    <div
      id={id}
      ref={sectionRef}
      className="home-deferred-section"
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
      {isVisible && (
        <Suspense fallback={<div className="home-section-loader" />}>
          {children}
        </Suspense>
      )}
    </div>
  );
};

const Home = () => {
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const enableDeferredSections = () => setHasScrolled(true);

    window.addEventListener("scroll", enableDeferredSections, {
      passive: true,
      once: true,
    });
    window.addEventListener("wheel", enableDeferredSections, {
      passive: true,
      once: true,
    });
    window.addEventListener("touchmove", enableDeferredSections, {
      passive: true,
      once: true,
    });

    return () => {
      window.removeEventListener("scroll", enableDeferredSections);
      window.removeEventListener("wheel", enableDeferredSections);
      window.removeEventListener("touchmove", enableDeferredSections);
    };
  }, []);

  useEffect(() => {
    if (location.hash !== "#new-arrivals") return undefined;

    setHasScrolled(true);

    let attempts = 0;
    const scrollToNewArrivals = () => {
      const target = document.getElementById("new-arrivals");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      attempts += 1;
      if (attempts < 6) {
        window.setTimeout(scrollToNewArrivals, 160);
      }
    };

    const timer = window.setTimeout(scrollToNewArrivals, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <div
      className="home-page"
      style={{
        "--bk-section-bg": `url(${headerBackground})`,
        "--bk-header-bg": `url(${headerBackground})`,
      }}
    >
      <main className="bk-home-main">
        <FabricStrip />
        <OfferBand />
        <HeroSlider />

        <DeferredSection minHeight={150} canObserve={hasScrolled}>
          <WhyChooseUs />
        </DeferredSection>
        <DeferredSection minHeight={360} canObserve={hasScrolled}>
          <PopularSarees />
        </DeferredSection>
        <DeferredSection minHeight={280} canObserve={hasScrolled}>
          <BrowseCircles />
        </DeferredSection>
        <DeferredSection id="new-arrivals" minHeight={380} canObserve={hasScrolled}>
          <NewArrivals />
        </DeferredSection>
        <DeferredSection minHeight={480} canObserve={hasScrolled}>
          <OccasionCollections />
        </DeferredSection>
        <DeferredSection minHeight={520} canObserve={hasScrolled}>
          <ReviewsStory />
        </DeferredSection>
        <DeferredSection minHeight={220} canObserve={hasScrolled}>
          <FaqSection />
        </DeferredSection>
      </main>

    </div>
  );
};

export default Home;
