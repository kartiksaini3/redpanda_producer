import express from "express";
import axios from "axios";
import { Kafka } from "kafkajs";
import { ENV } from "./utils/constants.js";
import { produceMessage } from "./utils/functions.js";

const kafka = new Kafka({
  clientId: "node-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();
await producer.connect();

const app = express();

app.get(["/blocks", "/blocks/:limit"], async (req, res) => {
  const limit = +req.params.limit || null;

  try {
    // fetch latest block height
    const statusRes = await axios.post(ENV.RPC_ENDPOINT, {
      jsonrpc: "2.0",
      id: 1,
      method: "status",
      params: [],
    });

    const latestHeight = +statusRes.data.result.sync_info.latest_block_height;
    await produceMessage(producer, "latest_block_number", latestHeight);

    let startHeight = 1;
    startHeight = limit
      ? Math.max(latestHeight - limit + 1, startHeight)
      : startHeight;

    const blocks = [];
    for (let height = startHeight; height <= latestHeight; height++) {
      // fetch block info
      const blockRes = await axios.post(ENV.RPC_ENDPOINT, {
        jsonrpc: "2.0",
        id: height,
        method: "block",
        params: { height: `${height}` },
      });
      await produceMessage(producer, "block_info", blockRes);
      await produceMessage(producer, "current_block_number", height);
    }
    res.json({ message: "Blocks produced" });
  } catch (err) {
    console.error("Error fetching blocks:", err.message);
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
});

app.listen(ENV.PORT, () => {
  console.log(`Producer running on port ${ENV.PORT}`);
});
