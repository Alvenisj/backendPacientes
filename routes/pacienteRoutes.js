import express from 'express';
import checkAutenticacion from '../middleware/autenticacionMiddleware.js';

import { registrarPacientes,
         obtenerPacientes,
         obtenerUnSoloPaciente,
         actualizarPaciente,
         eliminarPaciente } from '../controllers/pacienteController.js'

// INSTANCIAMOS EL ROUTER DE LOS PACIENTES
const router = express.Router();


// UNA FORMA DE HACER DOS MÉTODOS HACIA LA MISMA RUTA RAÍZ DE MANERA ENCADENADA
router.route('/')
    .post( checkAutenticacion, registrarPacientes )
    .get( checkAutenticacion, obtenerPacientes );

router.route('/:id')
    .get( checkAutenticacion, obtenerUnSoloPaciente )
    .put( checkAutenticacion, actualizarPaciente )
    .delete( checkAutenticacion, eliminarPaciente );




// EXPORTAMOS EL ARCHIVO DE LA RUTAS DE LOS PACIENTES
export default router;