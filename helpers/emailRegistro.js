import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  // NOS TRAEMOS ESTE CÓDIGO DE LA PÁGINA DE MAILTRAP CON LA INTEGRACIÓN DE NODEJS
  // SON LAS CREDENCIALES DEL EMAIL
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //ENVIAMOS EL EMAIL
  const { nombre, email, token } = datos;
  const info = await transport.sendMail({
    from: "Therapy HealthyCare S.A.S",
    to: email,
    subject: "Comprueba tu cuenta del sistema",
    text: "Comprueba tu cuenta del sistema",
    html: `<p>Hola: ${nombre}, comprueba nuevamente tu cuenta del sistema.</p>
                <p>Tu cuenta ya está lista, sólo debes comprobarla en el siguiente enlace:
                <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${token}">Comprobar Cuenta</a> </p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `,
  });

  console.log("Mensaje Enviado: %s", info.messageId);
};

export default emailRegistro;
