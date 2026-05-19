const OfferBand = ({ coupon, background }) => {
  if (!coupon) return null;

  return (
    <div
      className="bk-offer-band"
      style={{ "--bk-offer-bg": `url(${background})` }}
    >
      <div className="bk-offer-main">
        <span className="bk-offer-title">
          {coupon.discount_type === "percentage" ? (
            `Flat ${coupon.discount_percent}% OFF`
          ) : (
            <>Flat &#8377;{Number(coupon.discount_amount).toLocaleString()} OFF</>
          )}
        </span>
        <span className="bk-offer-divider" aria-hidden="true" />
        <span className="bk-offer-code-wrap">
          <span className="bk-offer-code-label">USE CODE:</span>
          <span className="bk-offer-code">{coupon.code}</span>
        </span>
      </div>
    </div>
  );
};

export default OfferBand;
