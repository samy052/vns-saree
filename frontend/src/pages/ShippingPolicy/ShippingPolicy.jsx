import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Shipping Policy
          </h1>
          <p className="text-[#D4AF37]">Free shipping on all orders above ₹999</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Processing Time</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day. Custom or pre-order items may take additional processing time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. Shipping Rates</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer free standard shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 is charged. Express shipping is available for an additional fee of ₹199.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Delivery Time</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Standard delivery takes 5-7 business days. Express delivery takes 2-3 business days. Delivery times may vary based on your location and any unforeseen circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once your order is shipped, you will receive an email with a tracking number. You can track your order status by logging into your account or using the tracking link provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Delivery Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If your package is lost or damaged during transit, please contact us within 48 hours of the expected delivery date. We will work with our courier partners to resolve the issue promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. International Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We currently ship only within India. International shipping options will be available soon. For special international requests, please contact us at support@banarasikala.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For shipping-related queries, contact us at support@banarasikala.com or call +91 98765 43210 (Mon-Sat, 10AM-7PM)
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ShippingPolicy;
