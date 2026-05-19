import { useState } from "react";

const FAQ_ITEMS = [
  ["How long does delivery take?", "Orders usually arrive within 5-7 business days."],
  ["What is your return policy?", "Returns are accepted as per our return and exchange policy."],
  ["Do you offer Cash on Delivery?", "Cash on Delivery availability depends on your delivery location."],
  ["How can I track my order?", "You can track your order from the My Orders page after login."],
  ["Are the sarees 100% authentic?", "Yes, every saree is quality checked before dispatch."],
  ["Do you ship internationally?", "International shipping is available for selected locations."],
];

const FaqSection = ({ background }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className="bk-faq-section"
      style={{ "--bk-faq-bg": `url(${background})` }}
      aria-labelledby="faq-title"
    >
      <div className="bk-faq-shell">
        <h2 id="faq-title">Frequently Asked Questions</h2>
        <div className="bk-faq-grid">
          {FAQ_ITEMS.map(([question, answer], index) => {
            const isOpen = openIndex === index;

            return (
              <div className={`bk-faq-item ${isOpen ? "is-open" : ""}`} key={question}>
                <button
                  type="button"
                  className="bk-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(index)}
                >
                  <span>{question}</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {isOpen && <p>{answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
