const WhyChooseUs = ({ items }) => (
  <section className="bk-why-choose" aria-labelledby="why-choose-title">
    <div className="bk-why-shell">
      <div className="bk-why-heading">
        <h2 id="why-choose-title">Why Choose Us</h2>
        <span aria-hidden="true" />
      </div>

      <div className="bk-why-grid">
        {items.map(({ title, subtitle, icon: Icon }) => (
          <div className="bk-why-item" key={`${title}-${subtitle}`}>
            <Icon className="bk-why-icon" strokeWidth={1.8} />
            <p>
              <span>{title}</span>
              <span>{subtitle}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
