import nodemailer from 'nodemailer';

const emailOlvidePassword = async ( datos ) => {

    // NOS TRAEMOS ESTE CÓDIGO DE LA PÁGINA DE MAILTRAP CON LA INTEGRACIÓN DE NODEJS
    // SON LAS CREDENCIALES DEL EMAIL
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //ENVIAMOS EL EMAIL
      const { nombre, email, token } = datos;
      const info = await transport.sendMail({
        from: "Therapy HealthyCare S.A.S",
        to: email,
        subject: "Reestablece tu password...",
        text: "Reestablece tu password...",
        html: `<p>Hola: ${nombre}, has solicitado REESTABLECER tu password.</p>

                <p>sigue el siguiente enlace para generar un nuevo password:
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a> </p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      });

      console.log('Mensaje Enviado: %s', info.messageId );

}



export default emailOlvidePassword;