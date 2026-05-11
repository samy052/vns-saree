import "./TermsConditions.css";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Terms & Conditions
          </h1>
          <p className="text-[#D4AF37]">Please read these terms carefully before using our website</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Banarasi Kala. By accessing and using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. Use of Website</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use our website only for lawful purposes. You must not use our site in any way that causes damage to the website or impairment of the availability or accessibility of the website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Product Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to display our products as accurately as possible. However, actual colors may vary due to monitor settings. Product descriptions, pricing, and availability are subject to change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Orders and Payments</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders are subject to acceptance and availability. We reserve the right to refuse any order. Payment must be made in full before shipment. We accept various payment methods including credit/debit cards, UPI, and net banking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of Banarasi Kala and protected by copyright laws. Unauthorized use is strictly prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Banarasi Kala shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our maximum liability is limited to the purchase price of the product.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">7. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Varanasi, Uttar Pradesh.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on the website. Continued use of the site constitutes acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at support@banarasikala.com or call +91 98765 43210
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsConditions;
