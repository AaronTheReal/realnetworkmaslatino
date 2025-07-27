import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';
import MainController from './MainController.js';

import AuthController from './AuthController.js';

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
    // ✅ Usa rutas bien formadas
    router.route('/').get(MainController.apiGetTests);


    //login
    router.route('/login').post(AuthController.login);


    //Stream
   
    
    return router;
  }
}

