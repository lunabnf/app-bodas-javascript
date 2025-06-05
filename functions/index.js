import functions from "firebase-functions";
import nodemailer from "nodemailer";
import corsLib from "cors";

const cors = corsLib({ origin: true });

export const enviarCorreo = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { to, subject, message, enviadoPor } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "administracion@bodaleticiayeric.com",
        pass: "Eric69leticia&",
      },
    });

    try {
      await transporter.sendMail({
        from: `"Boda Leticia y Eric" <administracion@bodaleticiayeric.com>`,
        to,
        subject,
        text: message + "\n\n" + "Enviado por: " + enviadoPor,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});