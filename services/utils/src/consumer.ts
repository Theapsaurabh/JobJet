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
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { to, subject, html } = JSON.parse(
            message.value!.toString() || "{}",
          );
          const tranporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "xyz",
              pass: "app password",
            },
          });
          await tranporter.sendMail({
            from: '"JobJet 👻" <no-reply@jobjet.com>',
            to,
            subject,
            html,
          });
          console.log(`Mail has been send to ${to}`);
        } catch (error) {
            console.log("Error in sending mail:", error);

        }
      },
    });
  } catch (error) {
    console.log("Error in Mail Service consumer:", error);
  }
};
