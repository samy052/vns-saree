import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Privacy Policy
          </h1>
          <p className="text-[#D4AF37]">Your privacy is important to us</p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect information you provide directly to us when you make a purchase, create an account, or contact us. This may include your name, email address, phone number, shipping address, and payment information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to process your orders, communicate with you about your purchases, send you marketing communications (with your consent), and improve our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate our business, such as payment processors and shipping carriers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to access, correct, or delete your personal information. You may also opt-out of receiving marketing communications at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#800020] mb-4">6. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@banarasikala.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
