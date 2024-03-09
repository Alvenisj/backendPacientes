import express from 'express';
import { registrarUsuario, 
         confirmarUsuario,
         autenticarUsuario,
         olvidePassword,
         comprobarToken,
         nuevoPassword,
         perfilUsuario,
         actualizacionPerfilUsuario,
         cambiarPasswordPerfilUsuario } from '../controllers/usuarioController.js';

// MIDDLEWARE QUE MANEJA LA AUTENTICACIÓN DE LAS RUTAS PRIVADAS
import checkAutenticacion from '../middleware/autenticacionMiddleware.js';

// INSTANCIAMOS EL ROUTER() DE LOS USUARIOS
const router = express.Router();

// --------AQUÍ TENEMOS TODAS LAS RUTAS DEL USUARIO-------

// ÁREA PÚBLICA
// CREAMOS LOS PROCESOS DE LAS RUTAS USUARIOS
router.post('/', registrarUsuario );
// CREAMOS LA RUTA QUE CONFIRMA EL USUARIO
router.get('/confirmar/:token', confirmarUsuario );
// CREAMOS LA RUTA DE AUTENTICACIÓN DEL USUARIO LOGIN
router.post('/login', autenticarUsuario );
// CREAMOS LA RUTA CUANDO SE OLVIDA CONTRASEÑA
router.post('/olvide-password', olvidePassword );
// CREAMOS LA RUTA DONDE EL USUARIO RECIBE UN TOKEN DE RECUPERACIÓN DE CONTRASEÑA
router.get('/olvide-password/:token', comprobarToken );
// CREAMOS LA RUTA DONDE EL USUARIO DEFINE NUEVAMENTE SU PASSWORD NUEVO
router.post('/olvide-password/:token', nuevoPassword );

// // OTRA FORMA DE HACER EL comprobarToken y nuevoPassword ES DE LA SIGUIENTE MANERA:
// router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


// ÁREA PRIVADA
// CREAMOS LA RUTA DEL PERFIL DEL USUARIO
router.get('/perfil', checkAutenticacion, perfilUsuario );
router.put('/perfil/:id', checkAutenticacion, actualizacionPerfilUsuario );
router.put('/cambiarPassword', checkAutenticacion, cambiarPasswordPerfilUsuario );




// EXPORTAMOS EL ARCHIVO DE LA RUTAS DE LOS USUARIOS
export default router;