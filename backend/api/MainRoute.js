// routes/MainRoute.js
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

import MainController from './MainController.js';
import AuthController from './AuthController.js';
import BestController from './BestController.js';

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

    return router;
  }
}
