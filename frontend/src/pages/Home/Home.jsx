import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  HandHeart,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import chiffonImg from "../../assets/fabric/chiffon.png";
import cottonSilkImg from "../../assets/fabric/cotton_silk.png";
import georgetteImg from "../../assets/fabric/georgette.png";
import katanSilkImg from "../../assets/fabric/katan_silk.png";
import khaddiImg from "../../assets/fabric/khaddi.png";
import organzaImg from "../../assets/fabric/organza.png";
import satinSilkImg from "../../assets/fabric/satan_silk.png";
import tissueImg from "../../assets/fabric/tissue.png";
import headerBackground from "../../assets/header_backgroung.png";
import flatOfferBackground from "../../assets/flat/image.png";
import { API_ENDPOINTS } from "../../config/api";
import CategoryStrip from "./sections/CategoryStrip";
import CraftSection from "./sections/CraftSection";
import FaqSection from "./sections/FaqSection";
import HeroSlider from "./sections/HeroSlider";
import OfferBand from "./sections/OfferBand";
import PopularSarees from "./sections/PopularSarees";
import ReviewsStory from "./sections/ReviewsStory";
import WhyChooseUs from "./sections/WhyChooseUs";
import "./Home.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const heroDesktopSlides = import.meta.glob(
  "../../assets/hero/desktop/slide*.png",
  { eager: true, import: "default" },
);
const heroPhoneSlides = import.meta.glob("../../assets/hero/phone/slide*.png", {
  eager: true,
  import: "default",
});
const craftSectionImages = import.meta.glob(
  "../../assets/craft/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);
const storySectionImages = import.meta.glob(
  "../../assets/story/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

const getSlideNumber = (path) => Number(path.match(/slide(\d+)\.png$/)?.[1]);
const getSlideMap = (slides) =>
  Object.fromEntries(
    Object.entries(slides)
      .map(([path, image]) => [getSlideNumber(path), image])
      .filter(([id]) => Number.isFinite(id)),
  );

const desktopSlideMap = getSlideMap(heroDesktopSlides);
const phoneSlideMap = getSlideMap(heroPhoneSlides);

const HERO_SAREES = Object.keys(desktopSlideMap)
  .map(Number)
  .filter((id) => phoneSlideMap[id])
  .sort((a, b) => a - b)
  .map((id) => ({
    id,
    name: `Hero slide ${id}`,
    image: desktopSlideMap[id],
    mobileImage: phoneSlideMap[id],
  }));

const FABRIC_CATEGORIES = [
  { name: "Katan Silk", image: katanSilkImg },
  { name: "Organza", image: organzaImg },
  { name: "Tissue", image: tissueImg },
  { name: "Chiffon", image: chiffonImg },
  { name: "Georgette", image: georgetteImg },
  { name: "Khaddi", image: khaddiImg },
  { name: "Cotton Silk", image: cottonSilkImg },
  { name: "Satin Silk", image: satinSilkImg },
];

const WHY_CHOOSE_US = [
  { title: "100% Authentic", subtitle: "Banarasi Sarees", icon: Award },
  { title: "Handpicked", subtitle: "Premium Quality", icon: HandHeart },
  { title: "Secure", subtitle: "Payments", icon: ShieldCheck },
  { title: "Easy", subtitle: "Returns", icon: RotateCcw },
  { title: "Direct From", subtitle: "Banaras", icon: Landmark },
  { title: "Fast & Reliable", subtitle: "Delivery", icon: Truck },
];

const getSectionImage = (images, name) => {
  const entry = Object.entries(images).find(([path]) =>
    path.toLowerCase().includes(name),
  );
  return entry?.[1] || "";
};

const CRAFT_PANELS = [
  {
    title: "Handloom",
    text: "Woven by skilled artisans with love and heritage.",
    image: getSectionImage(craftSectionImages, "handloom"),
  },
  {
    title: "Powerloom",
    text: "Crafted with precision for elegance and value.",
    image: getSectionImage(craftSectionImages, "powerloom"),
  },
];

const BANARAS_STORY_IMAGES = {
  weave: getSectionImage(storySectionImages, "banaras-weave"),
  ghat: getSectionImage(storySectionImages, "banaras-ghat"),
};

const Home = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    fetch(`${API_ENDPOINTS.coupons}/homepage`)
      .then((r) => r.json())
      .then((d) => setCoupons(Array.isArray(d) ? d : []))
      .catch(() => {});

    fetch(`${API_ENDPOINTS.products}?specialCollection=true&limit=20`)
      .then((r) => r.json())
      .then((d) => setProducts((d.items || d).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch(`${API_ENDPOINTS.feedback}/approved`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFeedbacks(d.data || []);
      })
      .catch(() => {});
  }, []);

  const selectFabric = (name) => {
    navigate(`/collection?fabric=${encodeURIComponent(name)}`);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calcDiscount = (mrp, sell) => {
    if (!mrp || !sell || Number(mrp) <= Number(sell)) return 0;
    return Math.round(((Number(mrp) - Number(sell)) / Number(mrp)) * 100);
  };

  const getCoverImage = (product) => {
    const imgs = [...(product.images || []), ...(product.productImages || [])];
    if (!imgs.length) return product.image_url || product.image || "";
    return (imgs.find((img) => img.is_cover || img.is_primary) || imgs[0]).url;
  };

  const coupon = coupons[0] || null;
  const fabricMarqueeCategories = [...FABRIC_CATEGORIES, ...FABRIC_CATEGORIES];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#F5ECD7]"
      style={{
        "--bk-section-bg": `url(${headerBackground})`,
        "--bk-header-bg": `url(${headerBackground})`,
      }}
    >
      <main>
        <CategoryStrip
          categories={FABRIC_CATEGORIES}
          marqueeCategories={fabricMarqueeCategories}
          onSelectFabric={selectFabric}
        />
        <OfferBand coupon={coupon} background={flatOfferBackground} />
        <HeroSlider slides={HERO_SAREES} />
        <WhyChooseUs items={WHY_CHOOSE_US} />
        <PopularSarees
          loading={loading}
          products={products}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          calcDiscount={calcDiscount}
          getCoverImage={getCoverImage}
        />
        <CraftSection panels={CRAFT_PANELS} />
        <ReviewsStory
          storyImages={BANARAS_STORY_IMAGES}
          reviews={feedbacks}
        />
        <FaqSection background={BANARAS_STORY_IMAGES.ghat} />
      </main>
    </div>
  );
};

export default Home;
