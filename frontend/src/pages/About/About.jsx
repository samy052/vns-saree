import "./About.css";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#800020] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            The Heart of Banarasi Kala
          </h1>
          <p className="text-lg text-[#D4AF37] italic">
            Welcome to Banarasi Kala, your premium destination for the finest
            Banarasi weaves.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <p
            className="text-gray-700 text-lg leading-relaxed mb-8"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            A Banarasi sari is not just a piece of clothing; it is a piece of
            art, a legacy passed down through generations, and a symbol of
            Indian grace. Our brand was born out of a deep love for the timeless
            craftsmanship of Banaras, with a mission to bring these royal drapes
            directly to your wardrobe.
          </p>
        </section>

        {/* Our Curation Process */}
        <section className="mb-16">
          <h2
            className="text-3xl font-bold text-[#800020] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Our Curation Process
          </h2>
          <p
            className="text-gray-700 leading-relaxed mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            At Banarasi Kala, we believe in the beauty of perfection. Instead of
            mass-producing, we focus on curation.
          </p>
          <p
            className="text-gray-700 leading-relaxed"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Our team personally visits the heart of Banaras to handpick every
            single sari in our collection. We spend hours looking for the most
            intricate zari work, the softest silks, and the most unique designs.
            We don't just sell saris; we select masterpieces that reflect
            elegance and authenticity.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2
            className="text-3xl font-bold text-[#800020] mb-8"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Why Choose Banarasi Kala?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#FFF8F0] rounded-lg border-l-4 border-[#D4AF37]">
              <h3 className="font-bold text-[#800020] mb-2">
                Handpicked Excellence
              </h3>
              <p className="text-gray-600 text-sm">
                Every sari undergoes a strict quality check. If it's not
                perfect, it's not part of our collection.
              </p>
            </div>
            <div className="p-6 bg-[#FFF8F0] rounded-lg border-l-4 border-[#D4AF37]">
              <h3 className="font-bold text-[#800020] mb-2">
                Timeless Designs
              </h3>
              <p className="text-gray-600 text-sm">
                We bridge the gap between traditional heritage and modern style,
                ensuring you look stunning at every occasion.
              </p>
            </div>
            <div className="p-6 bg-[#FFF8F0] rounded-lg border-l-4 border-[#D4AF37]">
              <h3 className="font-bold text-[#800020] mb-2">
                Quality You Can Trust
              </h3>
              <p className="text-gray-600 text-sm">
                We are committed to transparency. What you see on our website is
                exactly what you receive at your doorstep.
              </p>
            </div>
            <div className="p-6 bg-[#FFF8F0] rounded-lg border-l-4 border-[#D4AF37]">
              <h3 className="font-bold text-[#800020] mb-2">Fair Value</h3>
              <p className="text-gray-600 text-sm">
                By sourcing smartly, we ensure that you get premium Banarasi
                craftsmanship at the most honest prices.
              </p>
            </div>
          </div>
        </section>

        {/* Founder Message */}
        <section className="mb-16 bg-[#800020] text-white p-8 md:p-12 rounded-2xl">
          <h2
            className="text-2xl font-bold text-[#D4AF37] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            A Message from the Founder
          </h2>
          <blockquote className="text-lg italic leading-relaxed border-l-4 border-[#D4AF37] pl-6">
            "Banarasi Kala started with a simple dream: to make every woman feel
            like royalty. I personally involve myself in selecting each design,
            ensuring that every thread tells a story of beauty and tradition.
            When you wear a sari from Banarasi Kala, you aren't just wearing a
            garment—you are wearing the soul of Banaras."
          </blockquote>
        </section>

        {/* Visual Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1590736704728-f4730bb3c3af?auto=format&fit=crop&q=80"
                alt="Banarasi Saree Detail"
                className="rounded-xl shadow-lg w-full h-80 object-cover"
              />
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1610030469915-0248719b7a37?auto=format&fit=crop&q=80"
                alt="Zari Work Detail"
                className="rounded-xl shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center bg-[#FFF8F0] p-8 rounded-xl">
          <h2
            className="text-2xl font-bold text-[#800020] mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Get in Touch
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-700">
            <div className="flex items-center gap-3">
              <iconify-icon
                icon="lucide:mail"
                className="text-[#800020] text-xl"
              ></iconify-icon>
              <span>support@banarasikala.com</span>
            </div>
            <div className="flex items-center gap-3">
              <iconify-icon
                icon="lucide:phone"
                className="text-[#800020] text-xl"
              ></iconify-icon>
              <span>+91 98765 43210</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Customer Care: Monday - Saturday (10:00 AM - 7:00 PM)
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
