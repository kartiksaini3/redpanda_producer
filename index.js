import { Kafka } from "kafkajs";
import { topics } from "./utils/constants.js";

const kafka = new Kafka({
  clientId: "node-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
await producer.connect();
for (let topic of topics) {
  await producer.send({
    topic,
    messages: [
      { key: `${topic}-1`, value: `Hello from ${topic} Node 1` },
      { key: `${topic}-2`, value: `Hello from ${topic} Node 2` },
      { key: `${topic}-3`, value: `Hello from ${topic} Node 3` },
    ],
  });
}
console.log("Messages Produced");
