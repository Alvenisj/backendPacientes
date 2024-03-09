// IMPORTAMOS EL MODELO DEL PACIENTE
import Paciente from '../models/pacientesModel.js';


// CONTROLADOR QUE GESIONA EL REGISTRO DE PACIENTES 
const registrarPacientes = async ( req, res ) => {
  
    // CREAMO UNA NUEVA INSTANCIA DE PACIENTE PARA ALAMACENAR LA INFORAMCIÓN
    const paciente = new Paciente( req.body );
    paciente.usuario = req.usuario._id;

    try {
        // IDENTIFICAMOS EL USUARIO QUE ESTÁ REGISTRANDO EL PACIENTE Y LO ALMACENAMOS
        const pacienteGuardado = await paciente.save();
        // Metodos de solicitud que deseas permitir
        res.json( pacienteGuardado );

    } catch( err ) {

        console.log( err );
    }

};

// CONTROLADOR QUE HACE UN LISTADO DE TODOS LOS PACIENTES, DE ACUERDO AL USUARIO
const obtenerPacientes = async ( req, res ) => {

     const pacientes = await Paciente.find().where('usuario').equals(req.usuario)
    res.json( pacientes );

}

// CONTROLADOR QUE LISTA UN ÚNICO PACIENTE POR ID, DE ACUERDO AL USUARIO
const obtenerUnSoloPaciente = async ( req, res ) => {
    const { id } = req.params;
    // NOS TRAEMOS LOS DATOS DEL PACIENTE CON SU ID
    const paciente = await Paciente.findById( id );

    if( !paciente ) {
        return res.status(400).json({ msg: "Upss... Paciente no encontrado"});
     }

    // CUANDO SE COMPARAN LOS ID DE MONGODB ES RECOMENDABLE USAR EL MÉTODO toString()
    if( paciente.usuario._id.toString() !== req.usuario._id.toString() ) {
        return res.json( { msg: "Acción no válida"} )
    }

    res.json( paciente );
 
}

// CONTROLADOR QUE ACTUALIZA UN ÚNICO PACIENTE POR ID, DE ACUERDO AL USUARIO
const actualizarPaciente =  async ( req, res ) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if( !paciente ) {
        return res.status(400).json({ msg: "Upss... Paciente no encontrado"});
     }

    if( paciente.usuario._id.toString() !== req.usuario._id.toString() ) {
        return res.json( { msg: "Acción no válida"} )
    }
    //ACTUALIZAR PACIENTE
    paciente.nombres = req.body.nombres || paciente.nombres;
    paciente.apellidos = req.body.apellidos || paciente.apellidos;
    paciente.email = req.body.email || paciente.email;
    paciente.direccion = req.body.direccion || paciente.direccion;
    paciente.telefono = req.body.telefono || paciente.telefono;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.descripcionSintomas = req.body.descripcionSintomas || paciente.descripcionSintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json( pacienteActualizado )

    } catch ( error ) {
        console.log( error );
    }


}

// CONTROLADOR QUE ELIMINA UN ÚNICO PACIENTE POR ID, DE ACUERDO AL USUARIO
const eliminarPaciente = async ( req, res ) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if( !paciente ) {
       return res.status(400).json({ msg: "Upss... Paciente no encontrado"});
    }

    if( paciente.usuario._id.toString() !== req.usuario._id.toString() ) {
        return res.json( { msg: "Acción no válida"} )
    }

    try {
        await paciente.deleteOne();
        res.json( { msg: 'Paciente Eliminado correctamente' } );

    } catch( error ) {
        console.log( error );
    }

}


export {
    
    registrarPacientes,
    obtenerPacientes,
    obtenerUnSoloPaciente,
    actualizarPaciente,
    eliminarPaciente

}