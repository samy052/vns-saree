import { useState } from "react";
import "./Contact.css";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    // Web3Forms Access Key - You can replace this with your own key from https://web3forms.com/
    formData.append("access_key", "f23a0283-8a44-4d5b-a9bb-bd25ea343936");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Message Sent Successfully!");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contact-page bg-[#F5F1E8]">
      {/* Hero Section */}
      <div className="contact-hero py-20 bg-gradient-to-b from-[#2D1B0E] to-[#3D2817] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://www.transparenttextures.com/patterns/carbon-fibre.png" 
            alt="pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold brand-font mb-4 text-[#D4AF37] animate-fade-in-up">
            Get In Touch
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg reveal-up active">
            Have questions about our Banarasi sarees? Our team is here to assist you with personalized support.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="contact-info space-y-12">
            <div>
              <h2 className="text-3xl font-bold brand-font text-[#800020] mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Visit our boutique or reach out through any of our channels. We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white rounded-2xl shadow-lg text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A3F35] uppercase text-xs tracking-widest mb-1">Our Boutique</h4>
                  <p className="text-gray-600">D 5/21, Tripura Bhairavi, Dashashwamedh, Varanasi, Uttar Pradesh 221001</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white rounded-2xl shadow-lg text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A3F35] uppercase text-xs tracking-widest mb-1">Call Us</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Mon-Sat: 10AM - 8PM</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white rounded-2xl shadow-lg text-[#800020] group-hover:bg-[#800020] group-hover:text-white transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A3F35] uppercase text-xs tracking-widest mb-1">Email Us</h4>
                  <p className="text-gray-600">info@banarasikala.com</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#D4AF37]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transition-all group-hover:scale-150"></div>
              <h3 className="text-xl font-bold brand-font text-[#800020] mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Working Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Monday - Saturday</span>
                  <span className="font-bold text-[#4A3F35]">10:00 AM - 08:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">Sunday</span>
                  <span className="font-bold text-red-500 uppercase text-[10px] bg-red-50 px-2 py-1 rounded">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-xl rotate-12">
                <MessageSquare className="w-10 h-10 text-[#800020]" />
              </div>

              <h2 className="text-3xl font-bold brand-font text-[#800020] mb-2">Send Message</h2>
              <p className="text-gray-500 mb-8 text-sm uppercase tracking-wider font-bold">We'll get back to you within 24 hours</p>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      placeholder="Your Email"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    required 
                    placeholder="Product Inquiry"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <textarea 
                    name="message" 
                    rows="5" 
                    required 
                    placeholder="Tell us what you're looking for..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-inner resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-[#800020] to-[#3D2817] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-[#800020]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {result || "Send Message"} <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-[450px] bg-gray-200 grayscale hover:grayscale-0 transition-all duration-700 mt-20 border-t-8 border-[#D4AF37]">
        <iframe 
          className="contact-map-frame"
          title="Varanasi Boutique Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.828604738555!2d83.00762931501258!3d25.305943983848416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2df83072f447%3A0xb76166e951b33324!2sDashashwamedh%20Ghat!5e0!3m2!1sen!2sin!4v1620300000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
