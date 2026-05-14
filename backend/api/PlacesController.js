// controllers/PlacesController.js
import BestRestaurants from '../models/BestRestaurants.js';
// import GooglePlacesService from '../services/GooglePlacesService.js';  ← lo importaremos después

class PlacesController {

  // TEST
  async apiGetTests(req, res) {
    try {
      res.json({ 
        success: true, 
        message: 'Ruta de prueba para Places/Restaurantes funcionando' 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /restaurants/:city  → Obtener mejores restaurantes de una ciudad
  async apiGetBestRestaurants(req, res) {
    try {
      const { city } = req.params;
      const cityLower = city.toLowerCase().trim();

      const data = await BestRestaurants.findOne({ city: cityLower });

      if (!data || !data.restaurants || data.restaurants.length === 0) {
        return res.status(404).json({
          message: `No hay restaurantes guardados para la ciudad: ${city}`,
          suggestion: 'Usa /restaurants/refresh/:city para actualizar'
        });
      }

      return res.json({
        city: data.city,
        lastUpdated: data.lastUpdated,
        count: data.restaurants.length,
        restaurants: data.restaurants
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: 'Error fetching restaurants', 
        error: err.message 
      });
    }
  }

  // POST /restaurants/refresh/:city  → Actualizar manualmente
  async apiRefreshRestaurants(req, res) {
    try {
      const { city } = req.params;
      const cityLower = city.toLowerCase().trim();

      // Aquí llamaremos al service más tarde
      // const result = await GooglePlacesService.updateCity(cityLower);

      // Por ahora simulamos
      return res.json({
        success: true,
        message: `Restaurantes de ${city} actualizados correctamente`,
        // data: result
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: 'Error refreshing restaurants', 
        error: err.message 
      });
    }
  }

  // GET /restaurants/cities  → Lista de ciudades disponibles
  async apiGetAvailableCities(req, res) {
    try {
      const cities = await BestRestaurants.find({})
        .select('city lastUpdated')
        .sort('city');

      return res.json({
        count: cities.length,
        cities: cities.map(c => ({
          city: c.city,
          lastUpdated: c.lastUpdated,
          restaurantCount: c.restaurants ? c.restaurants.length : 0
        }))
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: 'Error fetching cities', 
        error: err.message 
      });
    }
  }

  // POST /restaurants/refresh-all  → Actualizar todas las ciudades
  async apiRefreshAllCities(req, res) {
    try {
      // Aquí actualizaremos todas las ciudades configuradas
      const citiesToUpdate = ['boston', 'atlanta']; // Agrega más según necesites

      // const results = await Promise.all(
      //   citiesToUpdate.map(city => GooglePlacesService.updateCity(city))
      // );

      return res.json({
        success: true,
        message: 'Actualización de todas las ciudades iniciada',
        cities: citiesToUpdate
        // results
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: 'Error refreshing all cities', 
        error: err.message 
      });
    }
  }
}

const placesController = new PlacesController();
export default placesController;