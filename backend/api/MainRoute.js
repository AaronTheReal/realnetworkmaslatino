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

      // Reorder bulk
      router.route('/featured-pages/reorder').post(FeaturedPageController.apiReorder);

     
    return router;
  }
}
