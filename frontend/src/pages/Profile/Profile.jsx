import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.auth}/me`);
        const latestUser = response.data.user;
        setProfile(latestUser);
        
        // Update both the React state and storage so it persists
        setUser(latestUser);
        if (localStorage.getItem("customer")) {
          localStorage.setItem("customer", JSON.stringify(latestUser));
        } else if (sessionStorage.getItem("customer")) {
          sessionStorage.setItem("customer", JSON.stringify(latestUser));
        } else if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(latestUser));
        } else if (sessionStorage.getItem("user")) {
          sessionStorage.setItem("user", JSON.stringify(latestUser));
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const copyReferralLink = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(
        `${window.location.origin}/login?ref=${profile.referral_code}`
      );
      alert("Referral link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F0E4]">
        <div className="w-10 h-10 border-4 border-[#800020] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F0E4] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#3D2817] brand-font uppercase tracking-widest border-b border-[#D4AF37]/30 pb-4">
          My Profile
        </h1>

        <div className="bg-white shadow-xl shadow-[#800020]/5 rounded-2xl overflow-hidden border border-[#D4AF37]/20">
          <div className="bg-gradient-to-r from-[#800020] to-[#3D2817] p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <iconify-icon icon="lucide:user" style={{ fontSize: "100px" }}></iconify-icon>
            </div>
            <h2 className="text-2xl font-bold capitalize">{profile?.name}</h2>
            <p className="text-[#D4AF37] mt-1">{profile?.email}</p>
            <p className="text-white/80 mt-1">{profile?.phone}</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Section */}
              <div className="bg-[#FBF9F6] p-6 rounded-xl border border-[#D4AF37]/30 flex flex-col items-center text-center">
                <iconify-icon
                  icon="lucide:wallet"
                  className="text-4xl text-[#800020] mb-3"
                ></iconify-icon>
                <h3 className="text-sm font-bold text-[#3D2817]/70 uppercase tracking-widest mb-1">
                  Wallet Balance
                </h3>
                <p className="text-3xl font-bold text-[#800020]">
                  ₹{profile?.wallet_balance || 0}
                </p>
                <p className="text-xs text-[#3D2817]/60 mt-2 max-w-[200px]">
                  Use your wallet balance to get discounts on your next purchase!
                </p>
              </div>

              {/* Refer & Earn Section */}
              <div className="bg-[#FBF9F6] p-6 rounded-xl border border-[#D4AF37]/30 flex flex-col items-center text-center">
                <iconify-icon
                  icon="lucide:share-2"
                  className="text-4xl text-[#D4AF37] mb-3"
                ></iconify-icon>
                <h3 className="text-sm font-bold text-[#3D2817]/70 uppercase tracking-widest mb-1">
                  Refer & Earn
                </h3>
                <p className="text-xs text-[#3D2817]/60 mb-4 max-w-[220px]">
                  Share your referral link with friends. They get ₹50 on signup,
                  and you get ₹100 when they place their first order!
                </p>
                
                <div className="w-full bg-white border border-[#D4AF37]/30 rounded-lg p-3 flex justify-between items-center mb-3">
                  <span className="font-bold text-[#800020] tracking-wider">
                    {profile?.referral_code}
                  </span>
                  <button
                    onClick={copyReferralLink}
                    className="bg-[#D4AF37] text-[#800020] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded hover:bg-[#800020] hover:text-[#D4AF37] transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
