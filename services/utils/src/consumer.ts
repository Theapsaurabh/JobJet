import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";

export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    const consumer = kafka.consumer({ groupId: "mail-service-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "send-mail", fromBeginning: false });
    console.log(" Mail Service consumer started, litening for sending mail");

    await consumer.run({
  eachMessage: async ({ message }) => {
    try {
      if (!message.value) return;

      //  Parse Kafka message
      const parsed = JSON.parse(message.value.toString());

      //  Always work with array
      const mails = Array.isArray(parsed) ? parsed : [parsed];

      //  Create transporter ONCE per batch
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER, 
          pass: process.env.MAIL_PASS, 
        },
      });

      for (const mail of mails) {
        const { to, subject, html } = mail;

        //  Validation
        if (!to || !subject || !html) {
          console.error("❌ Invalid mail payload:", mail);
          continue;
        }

        await transporter.sendMail({
          from: '"JobJet 👻" <no-reply@jobjet.com>',
          to,
          subject,
          html,
        });

        console.log(`✅ Mail sent to ${to}`);
      }
    } catch (error) {
      console.error("❌ Error in sending mail:", error);
    }
  },
});

  } catch (error) {
    console.log("Error in Mail Service consumer:", error);
  }
};
