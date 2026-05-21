const { config } = require("../config/env");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

const pickFirst = (...values) => values.find((v) => typeof v === "string" && v.trim());

class GeoService {
  async reverseGeocode({ latitude, longitude }) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Invalid latitude/longitude");
    }

    const provider = String(config.geoProvider || "nominatim").toLowerCase();
    if (provider !== "nominatim") {
      throw new Error("Unsupported GEO_PROVIDER");
    }

    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lng));
    url.searchParams.set("addressdetails", "1");

    const response = await fetch(url.toString(), {
      headers: {
        // Nominatim requires a valid User-Agent.
        "User-Agent": config.geoUserAgent || "vns-saree/1.0 (support@vns-saree.local)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Reverse geocode failed (${response.status}): ${text || response.statusText}`);
    }

    const data = await response.json();
    const addr = data?.address || {};

    const pincode = addr.postcode || null;
    const city = pickFirst(addr.city, addr.town, addr.village, addr.county) || null;
    const state = addr.state || null;
    const road = pickFirst(addr.road, addr.neighbourhood, addr.suburb) || null;
    const houseNumber = addr.house_number || null;
    const landmark = pickFirst(addr.amenity, addr.building, addr.shop) || null;

    const addressLine1 = pickFirst(
      [houseNumber, road].filter(Boolean).join(" ").trim(),
      landmark,
      data?.display_name,
    ) || null;

    return {
      provider,
      latitude: lat,
      longitude: lng,
      pincode,
      city,
      state,
      address_line1: addressLine1,
      raw: config.geoIncludeRaw === true ? data : undefined,
    };
  }
}

module.exports = new GeoService();

