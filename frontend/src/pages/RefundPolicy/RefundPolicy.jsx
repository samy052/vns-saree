import "./RefundPolicy.css";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Refund Policy
          </h1>
          <p className="text-[#D4AF37]">Hassle-free returns and refunds</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Return Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We accept returns within 7 days of delivery for unused items in their original packaging with all tags attached. Items must be in the same condition as received.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. Non-Returnable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Custom-made sarees, blouse stitching services, and items marked as final sale cannot be returned. Items showing signs of wear or damage not due to our error are not eligible for return.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Refund Process</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once we receive your return, we will inspect the item and notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5-7 business days to your original payment method.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Exchange Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer exchanges for items of equal or lesser value within the 7-day window. If exchanging for a higher value item, the price difference will be charged.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Damaged or Defective Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos. We will arrange a free return and full refund or replacement at no additional cost.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For return requests or refund inquiries, contact us at support@banarasikala.com or call +91 98765 43210
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
