const GeoService = require("../services/GeoService");

class GeoController {
  async reverse(req, res) {
    try {
      const lat = req.query.lat ?? req.query.latitude;
      const lng = req.query.lng ?? req.query.lon ?? req.query.longitude;
      const result = await GeoService.reverseGeocode({ latitude: lat, longitude: lng });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new GeoController();

