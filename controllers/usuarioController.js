// IMPORTAMOS EL MODELO DE USUARIO DE LA BASE DE DATOS
import Usuario from "../models/usuarioModel.js";
// IMPORTAMOS LA FUNCIÓN QUE GENERA UN JSONWEBTOKEN
import generarJWT from "../helpers/generarJWT.js";
// IMPORTAMOS LA FUNCIÓN QUE GENERA UN TOKEN
import generarToken from "../helpers/generarToken.js";
// IMPORTAMOS LA FUNCIÓN QUE ENVIA EL EMAIL DE CONFIRMACIÓN
import emailRegistro from "../helpers/emailRegistro.js";
// IMPORTAMOS LA FUNCIÓN QUE ENVÍA EL EMAIL DE RECUPERACIÓN
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

// CONTROLADOR QUE GESIONA EL REGISTRO DE USUARIOS
const registrarUsuario = async (req, res) => {
  const { rolOption, email, nombre } = req.body;
  // REVISAR SI EL USUARIO ESTÁ DUPLICADO
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Upss... Usuario ya se encuentra registrado");
    return res.status(400).json({ msg: error.message });
  }

  if (!rolOption) {
    const error = new Error("Upss... Por favor ingresa el rol");
    return res.status(403).json({ msg: error.message });
  }

  try {
    //GUARDAMOS UN NUEVO USUARIO
    const usuario = new Usuario(req.body);
    const usuarioGuardado = await usuario.save();

    // ENVIAMOS EL EMAIL
    emailRegistro({
      email,
      nombre,
      token: usuarioGuardado.token,
    });

    res.json(usuarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

// CONTROLADOR QUE GESTIONA LA CONFIRMACIÓN DEL USUARIO
const confirmarUsuario = async (req, res) => {
  const { token } = req.params;
  // BUSCAMOS SI EXISTE EL USUARIO CON EL TOKEN
  const usuarioConfirmar = await Usuario.findOne({ token });
  res.json({ msg: "Usuario confirmado correctamente...." });
  if (!usuarioConfirmar) {
    const error = new Error("Upss... Token no valido");
    return res.status(400).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
  } catch (error) {
    console.log(error);
  }
};

// CONTROLADOR QUE GESTIONA LA AUTENTICACIÓN DEL USUARIO LOGIN
const autenticarUsuario = async (req, res) => {
  const { rolOption, email, password } = req.body;

  // COMPROBAR SI EL USUARIO EXISTE
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Upss... El usuario no existe");
    return res.status(403).json({ msg: error.message });
  }

  // COMPROBAMOS SI EL USUARIO SE ENCUENTRA CONFIRMADO
  if (!usuario.confirmado) {
    const error = new Error("Upss... la cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  // COMPROBAMOS QUE EL ROL COINCIDA
  if (usuario.rolOption !== rolOption) {
    const error = new Error(
      "Upss... El rol seleccionado no correponsde al usuario"
    );
    return res.status(403).json({ msg: error.message });
  }
  // REVISAMOS EL PASSWORD
  if (await usuario.comprobarPassword(password)) {
    // AUTENTICAMOS EL USUARIO CON EL JSONWEBTOKEN
    usuario.token = generarJWT(usuario.id);
    res.json({
      rol: usuario.rolOption,
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
      web: usuario.web,
      telefono: usuario.telefono,
    });
  } else {
    const error = new Error("Upss... El password es INCORRECTO");
    return res.status(401).json({ msg: error.message });
  }
};

// CONTROLADOR QUE GESTIONA LA CLAVE OLVIDADA Y ENVIA CORREO DE RECUPERACIÓN AL USUARIO QUE ENVIA POR METODO POST SU CORREO PARA VERIFICACIÓN DE SESION
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (!existeUsuario) {
    const error = new Error("Upss... El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }
  // SI EL USUARIO EXISTE GENERAMOS UN TOKEN Y LO ENVIAMOS AL USUARIO POR EMAIL
  try {
    existeUsuario.token = generarToken();
    await existeUsuario.save();
    // USAMOS LA FUNCIÓN DE LA CARPETA HELPERS "emailOlvidePassword"
    emailOlvidePassword({
      email,
      nombre: existeUsuario.nombre,
      token: existeUsuario.token,
    });
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

// CONTROLADOR QUE GESTIONA LA CLAVE OLVIDADA Y COMPRUEBA EL TOKEN
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  // VERIFICAMOS SI EXISTE EL TOKEN
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    // EL TOKEN ES VÁLIDO, EL USUARIO EXISTE
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Upss... El token no existe");
    return res.status(400).json({ msg: error.message });
  }
};

// CONTROLADOR QUE GESTIONA LA CLAVE OLVIDADA PARA GENERAR NUEVA CONTRASEÑA
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    const error = new Error("Upss... Hubo un error, el token no existe");
    return res.status(400).json({ msg: error.message });
  }
  try {
    usuario.token = null;
    usuario.password = password;
    await usuario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

// CONTROLADOR QUE GESTIONA EL PERFIL DEL PROFESIONAL
const perfilUsuario = (req, res) => {
  const { usuario } = req;

  res.json({ perfil: usuario });
};

// CONTROLADOR QUE GESTIONA LA ACTUALIZACIÓN DEL PERFIL DEL PROFESIONAL
const actualizacionPerfilUsuario = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) {
    const error = new Error("Hubo en error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.email = req.body.email || usuario.email;
    usuario.web = req.body.web || usuario.web;
    usuario.telefono = req.body.telefono || usuario.telefono;

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const cambiarPasswordPerfilUsuario = async (req, res) => {
  // LEER LOS DATOS DEL USUARIO Y LO QUE VIENE DEL BODY
  const { id } = req.usuario;
  const { password_actual, password_nuevo } = req.body;

  // COMPROBAR QUE EXISTA EL USUARIO
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }
  // console.log(usuario);
  // COMPROBAR EL PASSWORD
  if (await usuario.comprobarPassword(password_actual)) {
    // ALMACENAR EL NUEVO PASSWORD
    usuario.password = password_nuevo;
    await usuario.save();
    res.json({ msg: "Password almacenado correctamente" });
  } else {
    const error = new Error("El password ingresado es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrarUsuario,
  confirmarUsuario,
  autenticarUsuario,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfilUsuario,
  actualizacionPerfilUsuario,
  cambiarPasswordPerfilUsuario,
};
