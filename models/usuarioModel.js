import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Generamos el Id automaticamente desde el helpers
import generarToken from "../helpers/generarToken.js";

// DEFINIMOS EL SCHEMA DE LOS USUARIOS
const usuarioShema = mongoose.Schema({
  nombre: {
    type: String,
    requireed: [true, "El nombre es obligatorio"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  email: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarToken(),
  },
  rolOption: {
    type: String,
    required: [true, "El rol es obligatorio"],
    enum: [],
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

// HASHEAMOS ANTES DE GUARDAR REGISTROS EN LA BASE DE DATOS
usuarioShema.pre("save", async function (next) {
  // SI EL PASSWORD YA SE ENCUENTRA HASHEADO NO LO VUELVE A HASHEAR
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// EL passwordFormulario es el que recibimos desde el inicio de sesion
usuarioShema.methods.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

// registramos el Schema en mogoose
const Usuario = mongoose.model("Usuario", usuarioShema);

// EXPORTAMOS EL MODELO
export default Usuario;
