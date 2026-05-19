import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const PopularSarees = ({
  loading,
  products,
  wishlist,
  onToggleWishlist,
  calcDiscount,
  getCoverImage,
}) => {
  if (!loading && products.length === 0) return null;

  return (
    <section className="bk-popular-section">
      <div className="bk-popular-shell">
        <div className="bk-popular-header">
          <div className="bk-popular-title-wrap">
            <h2>Popular Sarees</h2>
          </div>
          <Link to="/collection" className="bk-popular-view-all">
            View All
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>

      {loading ? (
        <div className="bk-popular-grid bk-popular-skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bk-popular-card bk-popular-skeleton">
              <div className="bk-popular-skeleton-image" />
              <div className="bk-popular-card-body">
                <div className="bk-popular-skeleton-line wide" />
                <div className="bk-popular-skeleton-line" />
                <div className="bk-popular-skeleton-line short" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1.12}
          centeredSlides={true}
          spaceBetween={18}
          slidesPerGroup={1}
          loop={true}
          speed={760}
          autoplay={{
            delay: 2600,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            480: {
              slidesPerView: 1.4,
              centeredSlides: true,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 2.2,
              slidesPerGroup: 1,
              spaceBetween: 18,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 1,
              centeredSlides: false,
            },
            1200: {
              slidesPerView: 6,
              slidesPerGroup: 1,
              centeredSlides: false,
            },
          }}
          className="bk-popular-grid bk-popular-carousel"
        >
          {products.slice(0, 12).map((product) => {
            const sell = Number(product.selling_price || product.price);
            const mrp = Number(product.mrp_price || product.mrp || 0);
            const disc = calcDiscount(mrp, sell);
            const img = getCoverImage(product) || product.image || "";
            const liked = wishlist[product.id];

            return (
              <SwiperSlide key={product.id}>
                <article className="bk-popular-card">
                  <Link
                    to={`/product/${product.slug}`}
                    className="bk-popular-card-link"
                  >
                    <div className="bk-popular-image-wrap">
                      <img
                        src={img}
                        alt={product.name}
                        className="bk-popular-image"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          onToggleWishlist(product.id);
                        }}
                        className="bk-popular-wishlist"
                        aria-label="Wishlist"
                      >
                        <svg
                          width="23"
                          height="23"
                          fill={liked ? "#800020" : "none"}
                          stroke={liked ? "#800020" : "#fff"}
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>

                    <div className="bk-popular-card-body">
                      <h3>{product.name}</h3>
                      <div className="bk-popular-price-row">
                        <span className="bk-popular-price">
                          &#8377;{sell.toLocaleString("en-IN")}
                        </span>
                        {mrp > sell && (
                          <span className="bk-popular-mrp">
                            &#8377;{mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                        {disc > 0 && (
                          <span className="bk-popular-discount">
                            {disc}% OFF
                          </span>
                        )}
                      </div>
                      <div className="bk-popular-rating">
                        <svg width="13" height="13" fill="#B9872A" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {product.rating && <span>{product.rating}</span>}
                        {(product.reviews || product.review_count) && (
                          <span>
                            ({product.reviews || product.review_count})
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      </div>
    </section>
  );
};

export default PopularSarees;
