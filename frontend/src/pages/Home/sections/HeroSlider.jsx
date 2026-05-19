import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const HeroSlider = ({ slides }) => (
  <div className="bk-hero-wrap">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      slidesPerView={1}
      autoplay={{ delay: 5500, disableOnInteraction: false }}
      loop
      navigation={{
        nextEl: ".hs-next",
        prevEl: ".hs-prev",
      }}
      pagination={{ clickable: true }}
      className="hero-swiper bk-hero-swiper"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <picture>
            <source media="(max-width: 768px)" srcSet={slide.mobileImage} />
            <img src={slide.image} alt={slide.name} className="bk-hero-image" />
          </picture>
        </SwiperSlide>
      ))}

      <button
        className="hs-prev bk-hero-arrow bk-hero-arrow-prev"
        aria-label="Previous slide"
      >
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="#2D1B0E"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        className="hs-next bk-hero-arrow bk-hero-arrow-next"
        aria-label="Next slide"
      >
        <svg
          width="17"
          height="17"
          fill="none"
          stroke="#2D1B0E"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </Swiper>
  </div>
);

export default HeroSlider;
