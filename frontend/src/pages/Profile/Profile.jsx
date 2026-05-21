import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const formatMoney = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) return "₹0";
  return `₹${num.toFixed(2)}`;
};

const toDateString = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [addrError, setAddrError] = useState("");
  const [addrForm, setAddrForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: true,
  });
  const [addrSaving, setAddrSaving] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const referralLink = useMemo(() => {
    const code = profile?.referral_code;
    if (!code) return "";
    const url = new URL("/login", window.location.origin);
    url.searchParams.set("mode", "signup");
    url.searchParams.set("ref", code);
    return url.toString();
  }, [profile?.referral_code]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [meRes, walletRes, addrRes] = await Promise.all([
          api.get("/api/customers/me"),
          api.get("/api/wallet"),
          api.get("/api/addresses"),
        ]);
        if (!alive) return;
        setProfile(meRes.data);
        setWallet(walletRes.data);
        setAddresses(Array.isArray(addrRes.data) ? addrRes.data : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.message || err.message || "Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
    setAddrForm((prev) => ({
      ...prev,
      name: profile?.name || prev.name,
      phone: profile?.phone || prev.phone,
    }));
  }, [profile?.id]);

  const onCopyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const onShareReferral = async () => {
    if (!referralLink) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Refer & Earn",
          text: "Sign up using my referral link and get ₹100 in wallet!",
          url: referralLink,
        });
        return;
      }
    } catch {
      // ignore
    }

    await onCopyReferral();
  };

  const onPickAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("avatar", file);
      const res = await api.post("/api/customers/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => (prev ? { ...prev, avatar_url: res.data.avatar_url } : prev));
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Avatar upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const goResetPassword = () => {
    const email = profile?.email || user?.email || "";
    const url = new URL("/login", window.location.origin);
    url.searchParams.set("mode", "forgot");
    if (email) url.searchParams.set("email", email);
    navigate(`${url.pathname}${url.search}`);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAddrChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddrForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const refreshAddresses = async () => {
    setAddrLoading(true);
    setAddrError("");
    try {
      const res = await api.get("/api/addresses");
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setAddrError(err?.response?.data?.message || err.message || "Failed to load addresses");
    } finally {
      setAddrLoading(false);
    }
  };

  const onAddAddress = async () => {
    setAddrSaving(true);
    setAddrError("");
    try {
      const payload = {
        ...addrForm,
      };
      await api.post("/api/addresses", payload);
      setAddrForm((prev) => ({
        ...prev,
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
      }));
      await refreshAddresses();
    } catch (err) {
      setAddrError(err?.response?.data?.message || err.message || "Failed to add address");
    } finally {
      setAddrSaving(false);
    }
  };

  const onDeleteAddress = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this address?")) return;
    setAddrError("");
    try {
      await api.delete(`/api/addresses/${id}`);
      await refreshAddresses();
    } catch (err) {
      setAddrError(err?.response?.data?.message || err.message || "Failed to delete address");
    }
  };

  const onSetDefault = async (addr) => {
    if (!addr?.id) return;
    setAddrError("");
    try {
      await api.put(`/api/addresses/${addr.id}`, { is_default: true });
      await refreshAddresses();
    } catch (err) {
      setAddrError(err?.response?.data?.message || err.message || "Failed to update address");
    }
  };

  const onCaptureLiveLocation = async () => {
    if (!navigator.geolocation) {
      setAddrError("Geolocation not supported on this device/browser.");
      return;
    }
    setLocLoading(true);
    setAddrError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          // Reverse geocode to autofill pincode/city/state and a suggested address line.
          try {
            const geo = await api.get("/api/geo/reverse", { params: { lat, lng } });
            const data = geo.data || {};
            setAddrForm((prev) => ({
              ...prev,
              pincode: data.pincode || prev.pincode,
              city: data.city || prev.city,
              state: data.state || prev.state,
              address_line1: prev.address_line1 || data.address_line1 || prev.address_line1,
              }));
          } catch (_) {
            // ignore reverse geocode failures
          }
        } catch (err) {
          setAddrError(err?.response?.data?.message || err.message || "Failed to save live location");
        } finally {
          setLocLoading(false);
        }
      },
      (geoErr) => {
        setAddrError(geoErr?.message || "Location permission denied.");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.put("/api/customers/me", {
        name: form.name,
        phone: form.phone,
      });
      const updated = res.data?.customer || res.data;
      setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-card">Loading profile...</section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <section className="profile-card">
          <p className="profile-error">{error}</p>
          <button type="button" className="profile-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <header className="profile-head">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" />
            ) : (
              <div className="profile-avatar-fallback">{(profile?.name || "U").slice(0, 1).toUpperCase()}</div>
            )}
            <label className={`profile-avatar-upload ${uploading ? "is-loading" : ""}`}>
              <input type="file" accept="image/*" onChange={onPickAvatar} disabled={uploading} />
              {uploading ? "Uploading..." : "Change Photo"}
            </label>
          </div>

          <div className="profile-meta">
            <div className="profile-meta-top">
              <h1>{profile?.name || "My Profile"}</h1>
              <div className="profile-meta-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    className="profile-btn profile-btn-outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="profile-btn profile-btn-outline"
                      onClick={() => {
                        setIsEditing(false);
                        setForm({ name: profile?.name || "", phone: profile?.phone || "" });
                      }}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="profile-btn profile-btn-primary"
                      onClick={onSave}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="profile-email">{profile?.email}</p>

            {!isEditing ? (
              <p>{profile?.phone}</p>
            ) : (
              <div className="profile-edit">
                <label>
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={onChange} />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" value={form.phone} onChange={onChange} inputMode="tel" />
                </label>
              </div>
            )}
            <p className="profile-joined">Joined: {toDateString(profile?.createdAt)}</p>
          </div>
        </header>

        <div className="profile-grid">
          <div className="profile-panel">
            <h2>Wallet</h2>
            <div className="profile-wallet-balance">{formatMoney(wallet?.wallet_balance ?? profile?.wallet_balance)}</div>
            <p className="profile-muted">Last transactions</p>
            <div className="profile-transactions">
              {(wallet?.transactions || []).slice(0, 8).map((tx) => (
                <div className="profile-tx" key={tx.id}>
                  <div>
                    <strong>{tx.type}</strong>
                    <span className="profile-muted">{toDateString(tx.created_at || tx.createdAt)}</span>
                  </div>
                  <div className={`profile-tx-amount ${Number(tx.amount) >= 0 ? "is-plus" : "is-minus"}`}>
                    {formatMoney(tx.amount)}
                    <span className="profile-muted">{tx.status}</span>
                  </div>
                </div>
              ))}
              {(!wallet?.transactions || wallet.transactions.length === 0) && (
                <p className="profile-muted">No transactions yet.</p>
              )}
            </div>
          </div>

          <div className="profile-panel">
            <h2>Refer & Earn</h2>
            <p className="profile-muted">Share this link. Your friend gets ₹100 in wallet. After delivery + 7 days, you get ₹50.</p>
            <div className="profile-referral">
              <input value={referralLink || "Referral code not available"} readOnly />
              <div className="profile-referral-actions">
                <button type="button" className="profile-btn" onClick={onCopyReferral} disabled={!referralLink}>
                  {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" className="profile-btn profile-btn-primary" onClick={onShareReferral} disabled={!referralLink}>
                  Share
                </button>
              </div>
            </div>
            <div className="profile-referral-code">
              <span className="profile-muted">Code:</span> <strong>{profile?.referral_code || "-"}</strong>
            </div>
          </div>

          <div className="profile-panel">
            <h2>Security</h2>
            <p className="profile-muted">Reset password via OTP on your email.</p>
            <button type="button" className="profile-btn profile-btn-primary" onClick={goResetPassword}>
              Reset Password
            </button>
          </div>

          <div className="profile-panel profile-panel-wide">
            <h2>Saved Addresses (max 3)</h2>
            <p className="profile-muted">
              Add up to 3 addresses. You can also capture live location (lat/lng) and save it with an address.
            </p>

            {addrError && <p className="profile-error">{addrError}</p>}

            <div className="profile-address-list">
              {addrLoading ? (
                <p className="profile-muted">Loading addresses...</p>
              ) : (
                <>
                  {addresses.map((a) => (
                    <div className="profile-address" key={a.id}>
                      <div className="profile-address-main">
                        <strong>
                          {a.label || "Address"} {a.is_default ? <span className="profile-badge">Default</span> : null}
                        </strong>
                        <div className="profile-muted">
                          {(a.name || "-")} · {(a.phone || "-")}
                        </div>
                        <div>
                          {a.address_line1}
                          {a.address_line2 ? `, ${a.address_line2}` : ""}
                          {a.city ? `, ${a.city}` : ""}
                          {a.state ? `, ${a.state}` : ""}
                          {a.pincode ? ` - ${a.pincode}` : ""}
                        </div>
                      </div>
                      <div className="profile-address-actions">
                        {!a.is_default && (
                          <button type="button" className="profile-btn" onClick={() => onSetDefault(a)}>
                            Set Default
                          </button>
                        )}
                        <button type="button" className="profile-btn" onClick={() => onDeleteAddress(a.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && <p className="profile-muted">No saved addresses yet.</p>}
                </>
              )}
            </div>

            {addresses.length < 3 && (
              <div className="profile-address-form">
                <div className="profile-form-row">
                  <label>
                    <span>Label</span>
                    <select name="label" value={addrForm.label} onChange={onAddrChange}>
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label>
                    <span>Name</span>
                    <input name="name" value={addrForm.name} onChange={onAddrChange} />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input name="phone" value={addrForm.phone} onChange={onAddrChange} inputMode="tel" />
                  </label>
                </div>

                <label>
                  <span>Address Line 1 *</span>
                  <input name="address_line1" value={addrForm.address_line1} onChange={onAddrChange} />
                </label>
                <label>
                  <span>Address Line 2</span>
                  <input name="address_line2" value={addrForm.address_line2} onChange={onAddrChange} />
                </label>

                <div className="profile-form-row">
                  <label>
                    <span>City</span>
                    <input name="city" value={addrForm.city} onChange={onAddrChange} />
                  </label>
                  <label>
                    <span>State</span>
                    <input name="state" value={addrForm.state} onChange={onAddrChange} />
                  </label>
                  <label>
                    <span>Pincode</span>
                    <input name="pincode" value={addrForm.pincode} onChange={onAddrChange} inputMode="numeric" />
                  </label>
                </div>

                <div className="profile-form-row">
                  <label className="profile-checkbox">
                    <input type="checkbox" name="is_default" checked={addrForm.is_default} onChange={onAddrChange} />
                    <span>Set as default</span>
                  </label>
                </div>

                <div className="profile-form-actions">
                  <button type="button" className="profile-btn" onClick={onCaptureLiveLocation} disabled={locLoading}>
                    {locLoading ? "Getting location..." : "Use Live Location"}
                  </button>
                  <button type="button" className="profile-btn profile-btn-primary" onClick={onAddAddress} disabled={addrSaving}>
                    {addrSaving ? "Saving..." : "Add Address"}
                  </button>
                </div>

              </div>
            )}
            {addresses.length >= 3 && (
              <p className="profile-muted">You reached the maximum of 3 saved addresses.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
