const axios = require('axios');

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

/**
 * ShipRocketService
 * -----------------
 * Wraps the ShipRocket REST API.
 * Auth token is cached in memory and refreshed automatically before it expires (24h).
 */
class ShipRocketService {
  constructor() {
    this._token = null;
    this._tokenExpiry = null; // ms timestamp
  }

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  async getToken() {
    // Return cached token if still valid (with a 5-min buffer)
    if (this._token && this._tokenExpiry && Date.now() < this._tokenExpiry - 5 * 60 * 1000) {
      return this._token;
    }

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    this._token = response.data.token;
    // ShipRocket tokens are valid for 24 hours
    this._tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    console.log('[ShipRocket] Auth token refreshed.');
    return this._token;
  }

  async _headers() {
    const token = await this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ─── ORDER ────────────────────────────────────────────────────────────────────

  /**
   * Create a shipment order on ShipRocket.
   * @param {object} orderData  - VNS Saree Order model instance + items array
   * @returns ShipRocket order + shipment_id
   */
  async createOrder(orderData) {
    const { order, items } = orderData;

    // ShipRocket expects all weight in kg; default each item to 0.5 kg if unknown
    const orderItems = items.map((item, idx) => ({
      name: item.name || item.product_name || `Product ${idx + 1}`,
      sku: item.product_id ? `SKU-${item.product_id}` : `SKU-${idx}`,
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: '',
    }));

    const totalWeight = items.reduce((sum) => sum + 0.5, 0); // 0.5 kg per item
    const now = new Date();
    const orderDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const payload = {
      order_id: `VNS-${order.id}`,
      order_date: orderDate,
      pickup_location: 'Home',  // Matches pickup location name in ShipRocket dashboard

      // Billing == Shipping for this store
      billing_customer_name: order.customer_name,
      billing_last_name: '',
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: String(order.pincode),
      billing_state: order.state || 'Uttar Pradesh',
      billing_country: 'India',
      billing_email: order.customer_email,
      billing_phone: String(order.phone),
      billing_is_billing_address: true,

      shipping_is_billing: 1,

      // Items
      order_items: orderItems,

      payment_method: 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: Number(order.discount_amount) || 0,
      sub_total: Number(order.total_amount),
      length: 15,  // cm
      breadth: 15,
      height: 5,
      weight: totalWeight,
      is_insurance: 0,
    };

    const headers = await this._headers();
    const response = await axios.post(`${BASE_URL}/orders/create/adhoc`, payload, { headers });
    return response.data;
  }

  // ─── AWB / COURIER ───────────────────────────────────────────────────────────

  /**
   * Recommend best courier for a shipment.
   * @param {string|number} shipmentId
   * @param {string} pincode  - destination pincode
   */
  async getServiceableCouries(shipmentId, pincode) {
    const headers = await this._headers();
    const response = await axios.get(
      `${BASE_URL}/courier/serviceability/?pickup_postcode=221001&delivery_postcode=${pincode}&weight=0.5&cod=0`,
      { headers }
    );
    return response.data;
  }

  /**
   * Assign courier and generate AWB for a shipment.
   * @param {string|number} shipmentId
   * @param {string|number|null} courierId  - leave null to let ShipRocket auto-assign
   */
  async assignAWB(shipmentId, courierId = null) {
    const headers = await this._headers();
    const payload = { shipment_id: String(shipmentId) };
    if (courierId) payload.courier_id = courierId;

    const response = await axios.post(`${BASE_URL}/courier/assign/awb`, payload, { headers });
    return response.data;
  }

  // ─── LABEL & MANIFEST ────────────────────────────────────────────────────────

  /**
   * Generate shipping label for one or more shipments.
   * @param {Array<string|number>} shipmentIds
   */
  async generateLabel(shipmentIds) {
    const headers = await this._headers();
    const response = await axios.post(
      `${BASE_URL}/courier/generate/label`,
      { shipment_id: shipmentIds },
      { headers }
    );
    return response.data; // Contains label_url
  }

  /**
   * Generate pickup manifest.
   * @param {Array<string|number>} shipmentIds
   */
  async generateManifest(shipmentIds) {
    const headers = await this._headers();
    const response = await axios.post(
      `${BASE_URL}/manifests/generate`,
      { shipment_id: shipmentIds },
      { headers }
    );
    return response.data; // Contains manifest_url
  }

  // ─── TRACKING ────────────────────────────────────────────────────────────────

  /**
   * Track shipment by AWB number.
   * @param {string} awb
   */
  async trackByAWB(awb) {
    const headers = await this._headers();
    const response = await axios.get(`${BASE_URL}/courier/track/awb/${awb}`, { headers });
    return response.data;
  }

  /**
   * Track shipment by ShipRocket order ID.
   * @param {string|number} shiprocketOrderId
   */
  async trackByOrderId(shiprocketOrderId) {
    const headers = await this._headers();
    const response = await axios.get(`${BASE_URL}/orders/show/${shiprocketOrderId}`, { headers });
    return response.data;
  }

  // ─── CANCEL ──────────────────────────────────────────────────────────────────

  /**
   * Cancel ShipRocket orders.
   * @param {Array<string|number>} shiprocketOrderIds
   */
  async cancelOrders(shiprocketOrderIds) {
    const headers = await this._headers();
    const response = await axios.post(
      `${BASE_URL}/orders/cancel`,
      { ids: shiprocketOrderIds },
      { headers }
    );
    return response.data;
  }

  // ─── PICKUP ──────────────────────────────────────────────────────────────────

  /**
   * Schedule a pickup for shipments.
   * @param {Array<string|number>} shipmentIds
   */
  async schedulePickup(shipmentIds) {
    const headers = await this._headers();
    const response = await axios.post(
      `${BASE_URL}/courier/generate/pickup`,
      { shipment_id: shipmentIds },
      { headers }
    );
    return response.data;
  }
}

module.exports = new ShipRocketService();
