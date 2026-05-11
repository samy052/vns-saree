import "./ReturnExchange.css";

const ReturnExchange = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Return & Exchange Policy
          </h1>
          <p className="text-[#D4AF37]">Easy returns and exchanges within 7 days</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Return Window</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You can return or exchange any item within 7 days of delivery. The item must be unused, unwashed, and in its original condition with all tags and packaging intact.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. How to Initiate Return</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To initiate a return, log into your account, go to "My Orders," select the order you wish to return, and click "Request Return." Alternatively, contact our customer care team for assistance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Exchange Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For exchanges, please specify the item you would like in exchange. We will reserve the new item once your return is approved. If the requested item is unavailable, we will issue a store credit or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Pickup Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your return is approved, our logistics partner will pick up the item from your registered address within 3-5 business days. Please ensure the item is properly packed for safe transit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Quality Check</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All returned items undergo a quality check at our facility. Items that do not meet our return criteria will be sent back to you. Please ensure items are free from perfume, deodorant marks, or any signs of wear.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For any queries regarding returns or exchanges, email us at support@banarasikala.com or WhatsApp us at +91 98765 43210
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ReturnExchange;
