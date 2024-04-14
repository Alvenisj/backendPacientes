import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

// INICIAMOS EXPRESS
const app = express();
// ACCEDEMOS AL PAQUETE DOTENV PARA ADMINISTRAR LAS VARIABLES DE ENTORNO
dotenv.config();
// NOS CONECTAMOS A LA BASE DE DATOS
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

// CONFIGURAMOS EL CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || dominiosPermitidos.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Acceso no permitido por CORS"));
      }
    },
  })
);

// CÓDIGO QUE PERMITE LEER LOS DATOS ENVIADOS POR POST
app.use(express.json());
// ASIGNAMOS LA RUTA DE USUARIO
app.use("/api/usuario", usuarioRoutes);

// ASIGNAMOS LA RUTA DE LOS PACIENTES
app.use("/api/pacientes", pacienteRoutes);

// CONECTAMOS EL SERVIDOR
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor conectado exitosamente en el puerto: ${PORT}`);
});
