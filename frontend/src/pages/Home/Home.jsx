import { lazy, Suspense, useEffect, useRef, useState } from "react";
import headerBackground from "../../assets/header_backgroung.png";
import CategoryStrip from "./CategoryStrip/CategoryStrip";
import HeroSlider from "./HeroSlider/HeroSlider";
import OfferBand from "./OfferBand/OfferBand";
import "./Home.css";

const WhyChooseUs = lazy(() => import("./WhyChooseUs/WhyChooseUs"));
const PopularSarees = lazy(() => import("./PopularSarees/PopularSarees"));
const CraftSection = lazy(() => import("./CraftSection/CraftSection"));
const ReviewsStory = lazy(() => import("./ReviewsStory/ReviewsStory"));
const FaqSection = lazy(() => import("./FaqSection/FaqSection"));

const DeferredSection = ({ children, minHeight = 240, canObserve = false }) => {
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

  return (
    <div
      className="home-page"
      style={{
        "--bk-section-bg": `url(${headerBackground})`,
        "--bk-header-bg": `url(${headerBackground})`,
      }}
    >
      <main className="bk-home-main">
        <CategoryStrip />
        <OfferBand />
        <HeroSlider />

        <DeferredSection minHeight={150} canObserve={hasScrolled}>
          <WhyChooseUs />
        </DeferredSection>
        <DeferredSection minHeight={360} canObserve={hasScrolled}>
          <PopularSarees />
        </DeferredSection>
        <DeferredSection minHeight={420} canObserve={hasScrolled}>
          <CraftSection />
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
