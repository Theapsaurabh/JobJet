import { Kafka } from "kafkajs";
import type { Admin } from "kafkajs";
import type { Producer } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();
let producer: Producer;
let admin: Admin;

export const connectKafka = async () => {
  try {
    const kafka = new Kafka({
      clientId: "auth-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    admin = kafka.admin();

    await admin.connect();
    const topic = await admin.listTopics();
    if (!topic.includes("send-mail")) {
      await admin.createTopics({
        topics: [
          {
            topic: "send-mail",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      console.log("Topic 'send-mail' created");
    }
    await admin.disconnect();
    
    producer = kafka.producer();
    await producer.connect();
    console.log("connected to kafka producer")

    console.log(" Kafka connected successfully");
    return { producer, admin };
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
    throw error;
  }
};
export const publishToTopic= async(Topic:string, messages:any[])=>{
  try {
    if (!producer) {
      throw new Error("Kafka producer is not connected");
      return;
    }
    await producer.send({
      topic: Topic,
      messages: [
        {
          value: JSON.stringify(messages), 
        },
      ],
    });
    console.log(`Message sent to topic ${Topic}`);
  } catch (error) {
    console.error("Error publishing message to Kafka topic:", error);
    throw error;
  }
}

export const disconnectKafka = async () => {
  try {
    if (producer) {
      await producer.disconnect();
      console.log("Kafka producer disconnected");
    }
    
  } catch (error) {
    console.error("Error disconnecting from Kafka:", error);
    throw error;
  }
};
