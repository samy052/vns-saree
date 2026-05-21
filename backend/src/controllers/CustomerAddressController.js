const CustomerAddress = require("../models/CustomerAddress");

const MAX_ADDRESSES = 3;

class CustomerAddressController {
  async list(req, res) {
    try {
      const rows = await CustomerAddress.findAll({
        where: { customer_id: req.user.id },
        order: [["is_default", "DESC"], ["updated_at", "DESC"]],
      });
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    try {
      const existingCount = await CustomerAddress.count({
        where: { customer_id: req.user.id },
      });
      if (existingCount >= MAX_ADDRESSES) {
        return res.status(400).json({ message: `You can save maximum ${MAX_ADDRESSES} addresses.` });
      }

      const {
        label,
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        is_default,
      } = req.body || {};

      if (!address_line1 || !String(address_line1).trim()) {
        return res.status(400).json({ message: "Please enter Address Line 1." });
      }

      const payload = {
        customer_id: req.user.id,
        label: label ? String(label).trim() : null,
        name: name ? String(name).trim() : null,
        phone: phone ? String(phone).trim() : null,
        address_line1: String(address_line1).trim(),
        address_line2: address_line2 ? String(address_line2).trim() : null,
        city: city ? String(city).trim() : null,
        state: state ? String(state).trim() : null,
        pincode: pincode ? String(pincode).trim() : null,
        is_default: !!is_default,
      };

      if (payload.is_default) {
        await CustomerAddress.update(
          { is_default: false },
          { where: { customer_id: req.user.id } },
        );
      }

      const created = await CustomerAddress.create(payload);
      return res.status(201).json(created);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const address = await CustomerAddress.findOne({
        where: { id, customer_id: req.user.id },
      });
      if (!address) return res.status(404).json({ message: "Address not found" });

      const {
        label,
        name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        is_default,
      } = req.body || {};

      const payload = {};
      if (label !== undefined) payload.label = label ? String(label).trim() : null;
      if (name !== undefined) payload.name = name ? String(name).trim() : null;
      if (phone !== undefined) payload.phone = phone ? String(phone).trim() : null;
      if (address_line1 !== undefined) payload.address_line1 = String(address_line1 || "").trim();
      if (address_line2 !== undefined) payload.address_line2 = address_line2 ? String(address_line2).trim() : null;
      if (city !== undefined) payload.city = city ? String(city).trim() : null;
      if (state !== undefined) payload.state = state ? String(state).trim() : null;
      if (pincode !== undefined) payload.pincode = pincode ? String(pincode).trim() : null;
      if (is_default !== undefined) payload.is_default = !!is_default;

      if (payload.address_line1 !== undefined && !payload.address_line1) {
        return res.status(400).json({ message: "Please enter Address Line 1." });
      }

      if (payload.is_default) {
        await CustomerAddress.update(
          { is_default: false },
          { where: { customer_id: req.user.id } },
        );
      }

      await address.update(payload);
      return res.status(200).json(address);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const address = await CustomerAddress.findOne({
        where: { id, customer_id: req.user.id },
      });
      if (!address) return res.status(404).json({ message: "Address not found" });

      await address.destroy();
      return res.status(200).json({ message: "Address deleted" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CustomerAddressController();
