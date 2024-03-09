import mongoose from "mongoose";


// DEFINIMOS EL SCHEMA DE LOS PACIENTES
const pacienteSchema = mongoose.Schema({
    nombres: {
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
    },
    email: {
        type: String, 
        required: [true, 'El correo es obligatorio'],
        unique: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String, // Puedes usar String o Number según tus necesidades
        required: true
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    descripcionSintomas: {
        type: String,
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {

    timestamps: true

});

// registramos el Schema en mogoose
const Paciente = mongoose.model('Paciente', pacienteSchema );

// EXPORTAMOS EL MODELO
export default Paciente;