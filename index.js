import "dotenv/config";
import express from "express";
import { Kafka } from "kafkajs";
import { getBlocks } from "./blocks/service.js";

const kafka = new Kafka({
  clientId: "node-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
await producer.connect();

const app = express();

// ENVs
const port = +process.env.PORT || 3000;
const rpcUrl = process.env.RPC_URL;

app.get(["/blocks", "/blocks/:limit"], async (req, res) => {
  const limit = +req.params.limit || null;
  return await getBlocks(limit, res, producer, rpcUrl);
});

app.listen(port, () => {
  console.log(`Producer running on port ${port}`);
});
