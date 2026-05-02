import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const rootRef = useRef(null);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const parallax = parallaxRef.current;

    // Intersection Observer for Reveal Animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    if (root) {
      root.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }


    // Parallax Effect for Hero
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]" ref={rootRef}>


      <main className="flex-grow">
        {/* Hero Section */}
        <section className="parallax-wrapper bg-[#140A05]">
          {/* Depth Layers */}
          <div className="parallax-bg scale-110 opacity-60" ref={parallaxRef}></div>

          <div className="absolute inset-0 hero-glow-overlay z-[1]"></div>
          <div className="absolute inset-0 pulse-layer z-[2]"></div>
          <div className="absolute inset-0 pattern-rotate z-[1]"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0 z-[3] pointer-events-none">
            <div className="orb w-48 h-48" style={{ left: '10%', animationDuration: '25s', animationDelay: '0s' }}></div>
            <div className="orb w-32 h-32" style={{ left: '70%', animationDuration: '35s', animationDelay: '-10s' }}></div>
            <div className="orb w-64 h-64" style={{ left: '40%', animationDuration: '45s', animationDelay: '-5s' }}></div>
          </div>

          <div className="max-w-5xl mx-auto px-4 text-center text-white relative z-10 hero-text-entry">
            <span className="text-[#D4AF37] tracking-[0.4em] uppercase text-sm mb-6 block font-bold drop-shadow-md">Since 1884</span>
            <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-tight brand-font">
              Generations of <br/> <span className="gold-shimmer drop-shadow-lg">Elegance</span>
            </h1>
            <p className="serif-text text-xl md:text-2xl italic opacity-90 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              "In the heart of Varanasi, we don't just weave fabric; <br className="hidden md:block"/> we weave stories that transcend time."
            </p>
            <div className="mt-12">
              <div className="w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent mx-auto animate-bounce opacity-50"></div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal">
                <h2 className="text-4xl md:text-5xl font-bold text-[#800020] mb-8 leading-tight brand-font">The Saga of <br/>Banaras Heritage</h2>
                <p className="serif-text text-lg text-gray-700 leading-relaxed mb-8 italic">
                  Our journey began on the misty banks of the Ganges, where my great-grandfather first setup a small loom under the banyan tree. What started as a passion for pure mulberry silk has evolved into a global symbol of Indian craftsmanship.
                </p>
                <p className="text-gray-600 leading-relaxed mb-10 text-sm uppercase tracking-widest font-semibold">
                  For centuries, Banarasi silk has been the choice of queens and commoners alike, each weave reflecting the spiritual vibrancy of Kashi. At Banaras Heritage, we preserve the authentic 'Kadhwa' technique, ensuring every thread of gold and silver zari is hand-interlaced with surgical precision.
                </p>
                <div className="flex items-center space-x-12">
                  <div>
                    <span className="block text-4xl font-bold text-[#800020] brand-font">140+</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Years of Legacy</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-bold text-[#800020] brand-font">350+</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Master Weavers</span>
                  </div>
                </div>
              </div>
              <div className="relative reveal group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 border border-[#D4AF37]/20">
                  <img src="https://images.unsplash.com/photo-1590736704728-f4730bb3c3af?auto=format&fit=crop&q=80" alt="Vintage Weaving" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#D4AF37] p-1 rounded-xl shadow-2xl rotate-3">
                  <div className="w-full h-full bg-[#800020] flex flex-col items-center justify-center text-center p-4">
                    <span className="brand-font text-white text-3xl font-bold">Purity</span>
                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-bold">Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship Process */}
        <section className="py-24 bg-[#F5F1E8]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-20 reveal">
              <h2 className="text-4xl font-bold text-[#3D2817] mb-4 brand-font uppercase tracking-widest">The Alchemy of Silk</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/20 reveal">
                <div className="w-12 h-12 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold mb-6 text-xl shadow-lg brand-font">
                  01
                </div>
                <h3 className="brand-font text-xl text-[#800020] mb-4 uppercase tracking-wider">Silk Selection</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold uppercase tracking-widest">Only AAA-grade pure mulberry silk from South India is chosen for our looms, ensuring strength and natural luster.</p>
              </div>
              {/* Step 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/20 reveal" style={{ transitionDelay: '150ms' }}>
                <div className="w-12 h-12 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold mb-6 text-xl shadow-lg brand-font">
                  02
                </div>
                <h3 className="brand-font text-xl text-[#800020] mb-4 uppercase tracking-wider">Zari Gilding</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold uppercase tracking-widest">Silver threads are electroplated with 24k gold to create the iconic Banarasi zari that never loses its shine.</p>
              </div>
              {/* Step 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/20 reveal" style={{ transitionDelay: '300ms' }}>
                <div className="w-12 h-12 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold mb-6 text-xl shadow-lg brand-font">
                  03
                </div>
                <h3 className="brand-font text-xl text-[#800020] mb-4 uppercase tracking-wider">The Naksha</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold uppercase tracking-widest">Artisans hand-draw intricate patterns on graph paper, translating art into a language the loom understands.</p>
              </div>
              {/* Step 4 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[#D4AF37]/20 reveal" style={{ transitionDelay: '450ms' }}>
                <div className="w-12 h-12 rounded-full bg-[#800020] text-[#D4AF37] flex items-center justify-center font-bold mb-6 text-xl shadow-lg brand-font">
                  04
                </div>
                <h3 className="brand-font text-xl text-[#800020] mb-4 uppercase tracking-wider">The Master Weave</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold uppercase tracking-widest">A single saree can take anywhere from 15 days to 6 months to complete on a traditional pit loom.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Master Weavers */}
        <section className="py-24 bg-[#3D2817] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl reveal">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 brand-font tracking-wider uppercase">The Hands of <span className="text-[#D4AF37]">Heritage</span></h2>
                <p className="serif-text text-xl italic opacity-80 leading-relaxed">
                  Meet the artisans who have carried the flame of Banarasi weaving for generations. Our master weavers are the true heart of the brand.
                </p>
              </div>
              <button className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold text-[10px] uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#3D2817] transition-all reveal">Meet All Artisans</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Weaver 1 */}
              <div className="weaver-card reveal">
                <div className="weaver-card-inner">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-8 group border border-white/10">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                      <p className="text-[10px] tracking-widest leading-relaxed uppercase font-bold text-[#D4AF37]">Artisan since 1982</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-2 brand-font uppercase tracking-tight">Shri Ramdas Ji</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-4 font-bold">Master of Jamdani Weave</p>
                  <p className="text-xs text-white/70 italic uppercase tracking-widest leading-relaxed">"Every saree I weave is a prayer I offer to the loom. It is the only life I know and love."</p>
                </div>
              </div>
              {/* Weaver 2 */}
              <div className="weaver-card reveal" style={{ transitionDelay: '200ms' }}>
                <div className="weaver-card-inner">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-8 group border border-white/10">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                      <p className="text-[10px] tracking-widest leading-relaxed uppercase font-bold text-[#D4AF37]">3rd Gen Artisan</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-2 brand-font uppercase tracking-tight">Mohammad Irfan</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-4 font-bold">Katan Silk Specialist</p>
                  <p className="text-xs text-white/70 italic uppercase tracking-widest leading-relaxed">"Precision is not an option; it's a requirement when you're working with real gold zari."</p>
                </div>
              </div>
              {/* Weaver 3 */}
              <div className="weaver-card reveal" style={{ transitionDelay: '400ms' }}>
                <div className="weaver-card-inner">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-8 group border border-white/10">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                      <p className="text-[10px] tracking-widest leading-relaxed uppercase font-bold text-[#D4AF37]">Pattern Expert</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-2 brand-font uppercase tracking-tight">Smt. Savitri Devi</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 mb-4 font-bold">Dyeing & Finishing Expert</p>
                  <p className="text-xs text-white/70 italic uppercase tracking-widest leading-relaxed">"Color is the soul of silk. I ensure that our dyes reflect the natural hues of Banaras."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ethical Sourcing */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="bg-[#800020] rounded-[2rem] p-12 lg:p-20 text-white flex flex-col lg:flex-row items-center gap-12 reveal border border-[#D4AF37]/20 shadow-2xl">
              <div className="lg:w-1/2">
                <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Our Promise</span>
                <h2 className="text-4xl font-bold mb-8 brand-font uppercase tracking-wider">Sustainability & Ethical Spirit</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <iconify-icon icon="lucide:leaf" className="text-3xl text-[#D4AF37]"></iconify-icon>
                    <div>
                      <h4 className="font-bold mb-1 uppercase tracking-widest text-sm">Natural Dyes</h4>
                      <p className="text-xs text-white/70 uppercase tracking-widest leading-relaxed font-semibold">We use eco-friendly, AZO-free dyes that are safe for both the artisan and the environment.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <iconify-icon icon="lucide:users" className="text-3xl text-[#D4AF37]"></iconify-icon>
                    <div>
                      <h4 className="font-bold mb-1 uppercase tracking-widest text-sm">Fair Wages</h4>
                      <p className="text-xs text-white/70 uppercase tracking-widest leading-relaxed font-semibold">Our weavers earn 40% above the market average, with full health and education support for their families.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <iconify-icon icon="lucide:award" className="text-3xl text-[#D4AF37]"></iconify-icon>
                    <div>
                      <h4 className="font-bold mb-1 uppercase tracking-widest text-sm">Certified Purity</h4>
                      <p className="text-xs text-white/70 uppercase tracking-widest leading-relaxed font-semibold">Every piece comes with the Silk Mark and Handloom Mark, ensuring the authenticity of your purchase.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                  <img src="https://images.unsplash.com/photo-1610030469915-0248719b7a37?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Eco silk" />
                </div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl mt-8 border border-white/10">
                  <img src="https://images.unsplash.com/photo-1610030469668-935142b96fe4?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Handloom" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Trust Bar */}
        <section className="py-12 bg-[#F5F1E8] border-y border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center md:justify-around items-center gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img src="https://silkmarkindia.com/assets/images/silkmark_logo.png" className="h-20 object-contain" alt="Silk Mark" />
              <img src="https://handloom.nic.in/assets/img/HandloomMarkLogo.png" className="h-16 object-contain" alt="Handloom Mark" />
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" className="h-10 object-contain" alt="Make In India" />
              <div className="text-center">
                <iconify-icon icon="lucide:shield-check" className="text-4xl text-[#800020]"></iconify-icon>
                <p className="text-[8px] font-bold uppercase mt-1 tracking-[0.2em]">Authenticity Guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4 reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-[#800020] mb-8 brand-font uppercase tracking-widest">Wear a Masterpiece</h2>
            <p className="serif-text italic text-xl text-gray-600 mb-12">Continue the legacy with a hand-woven Banarasi saree today.</p>
            <Link to="/collection" className="inline-block px-12 py-5 bg-[#800020] text-[#D4AF37] font-bold text-[10px] tracking-[0.3em] uppercase rounded-sm shadow-2xl hover:bg-[#3D2817] transition-all transform hover:-translate-y-1">
              Explore Collections
            </Link>
          </div>
        </section>
      </main>

      {/* Footer removed, handled by Layout */}
    </div>
  );
};

export default About;
