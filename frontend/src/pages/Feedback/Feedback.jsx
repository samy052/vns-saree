import { useState } from "react";
import "./Feedback.css";
import { Star, Send, MessageSquare, Quote } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5003/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ rating, comment })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Thank you! Your feedback has been submitted and is pending admin approval." });
        setComment("");
        setRating(5);
      } else {
        setMessage({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setMessage({ type: "error", text: "Failed to connect to the server." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page bg-[#F5F1E8] min-h-screen">
      <div className="feedback-hero py-20 bg-gradient-to-b from-[#800020] to-[#3D2817] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://www.transparenttextures.com/patterns/carbon-fibre.png" 
            alt="pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold brand-font mb-4 text-[#D4AF37] animate-fade-in-up">
            Customer Feedback
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Your opinion matters to us. Help us improve your experience at Banarasi Kala.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl border border-white relative">
          <div className="absolute -top-8 -left-8 w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-xl rotate-[-15deg]">
            <Quote className="w-10 h-10 text-[#800020]" />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold brand-font text-[#800020] mb-4">Share Your Experience</h2>
            <p className="text-gray-500 uppercase text-[10px] tracking-[0.2em] font-black">Logged in as {user?.name || "Customer"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Star Rating */}
            <div className="text-center space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rate your experience</label>
              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-all duration-300 transform hover:scale-125 focus:outline-none"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`w-12 h-12 ${
                        (hover || rating) >= star 
                          ? "star-active" 
                          : "text-gray-200"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[#800020] font-bold brand-font text-lg">
                {rating === 5 ? "Exceptional!" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Needs Improvement"}
              </p>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Your Review
              </label>
              <textarea 
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you loved about our sarees or how we can improve..."
                className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all shadow-inner resize-none min-h-[180px] text-gray-700 leading-relaxed"
              ></textarea>
            </div>

            {message.text && (
              <div className={`p-6 rounded-2xl text-sm font-bold text-center animate-scale-in ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
              }`}>
                {message.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={submitting}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-4 ${
                submitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#800020] to-[#3D2817] text-white hover:shadow-[#800020]/30 hover:scale-[1.02] active:scale-95"
              }`}
            >
              {submitting ? "Submitting..." : "Post Review"} <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="mt-16 text-center text-gray-400 text-xs font-medium italic">
          * Your review will be published on the website after a quick quality check by our team.
        </div>
      </div>
    </div>
  );
};

export default Feedback;
