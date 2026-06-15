// routes/MainRoute.js
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

import MainController from './MainController.js';
import AuthController from './AuthController.js';
import BestController from './BestController.js';
import TeamController from './TeamMemberController.js';
import VoiceController from './MeetController.js';
import FeaturedPageController from './FeaturedController.js';
import PlacesController from './PlacesController.js'
import PlacesExtraController from './PlacesExtraController.js'
import EventosController from './EventosController.js'
import WeatherController from './WeatherController.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'images'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default class MainRoute {
  static configRoutes(router) {
    // Home
    router.route('/').get(MainController.apiGetTests);

    // Login
    router.route('/login').post(AuthController.login);

    // Best Content Carousel
    router.route('/best-content').get(BestController.apiGetAll);
    router.route('/best-content/:id').get(BestController.apiGetById);
    router.route('/best-content').post(BestController.apiCreate);
    router.route('/best-content/:id').put(BestController.apiUpdate);
    router.route('/best-content/:id').delete(BestController.apiDelete);
    router.route('/best-content/refresh-embeds').post(BestController.apiRefreshEmbeds);




    // CRUD
    router.route('/team')
      .get(TeamController.apiGetAll)
      .post(TeamController.apiCreate);

    router.route('/team/:id')
      .get(TeamController.apiGetById)
      .put(TeamController.apiUpdate)
      .delete(TeamController.apiDelete);

    // Reordenar (bulk)
    router.route('/team/reorder').put(TeamController.apiReorder);


    // Test
    router.get('/voices/test', VoiceController.apiGetTests);

    // CRUD
    router
      .route('/voices')
      .get(VoiceController.apiGetAll)
      .post(VoiceController.apiCreate);

    router
      .route('/voices/:id')
      .get(VoiceController.apiGetById)
      .put(VoiceController.apiUpdate)
      .delete(VoiceController.apiDelete);

    // Reordenar
    router.put('/voices/reorder', VoiceController.apiReorder);

      // Featured Pages
      router.route('/featured-pages/test').get(FeaturedPageController.apiGetTests);

      router.route('/featured-pages')
        .get(FeaturedPageController.apiGetAll)   // Obtener todas
        .post(FeaturedPageController.apiCreate); // Crear una nueva

      router.route('/featured-pages/:id')
        .get(FeaturedPageController.apiGetById)   // Obtener por ID
        .put(FeaturedPageController.apiUpdate)    // Actualizar por ID
        .delete(FeaturedPageController.apiDelete); // Eliminar por ID

        // Places / Restaurants
        // IMPORTANTE: las rutas estáticas van ANTES de la dinámica /:city
        router.route('/restaurants/cities')
          .get(PlacesController.apiGetAvailableCities);

        router.route('/restaurants/refresh-all')
          .post(PlacesController.apiRefreshAllCities);

        router.route('/restaurants/refresh/:city')
          .post(PlacesController.apiRefreshRestaurants);

        router.route('/restaurants/:city')
          .get(PlacesController.apiGetBestRestaurants);

        // Weather (Open-Meteo a través de nuestro backend)
        router.route('/weather/:city')
          .get(WeatherController.apiGetWeather);

        // Turismo / Hangout / Fanzone (reutilizan Google Places)
        // IMPORTANTE: las rutas de refresh van ANTES de la dinámica /:city
        router.route('/turismo/refresh/:city')
          .post(PlacesExtraController.apiRefreshTurismo);
        router.route('/turismo/:city')
          .get(PlacesExtraController.apiGetTurismo);

        router.route('/hangout/refresh/:city')
          .post(PlacesExtraController.apiRefreshHangout);
        router.route('/hangout/:city')
          .get(PlacesExtraController.apiGetHangout);

        router.route('/fanzone/refresh/:city')
          .post(PlacesExtraController.apiRefreshFanzone);
        router.route('/fanzone/:city')
          .get(PlacesExtraController.apiGetFanzone);

        // Eventos (calendario Mundial 2026, dataset estático)
        router.route('/eventos/:city')
          .get(EventosController.apiGetEventosByCity);

      // Reorder bulk
      router.route('/featured-pages/reorder').post(FeaturedPageController.apiReorder);

     
    return router;
  }
}
