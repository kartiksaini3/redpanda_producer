// import { Kafka } from "kafkajs";
// import { topics } from "./utils/constants.js";

// const kafka = new Kafka({
//   clientId: "node-app",
//   brokers: ["localhost:9092"],
// });

// const producer = kafka.producer();
// await producer.connect();
// for (let topic of topics) {
//   await producer.send({
//     topic,
//     messages: [
//       { key: `${topic}-1`, value: `Hello from ${topic} Node 1` },
//       { key: `${topic}-2`, value: `Hello from ${topic} Node 2` },
//       { key: `${topic}-3`, value: `Hello from ${topic} Node 3` },
//     ],
//   });
// }
// console.log("Messages Produced");

// const express = require('express');
// const axios = require('axios');
import express from "express";
import axios from "axios";
import { ENV } from "./utils/constants.js";

const app = express();

app.get("/block/:number", async (req, res) => {
  const blockNumber = req.params.number;

  try {
    const response = await axios.post(ENV.RPC_URL, {
      jsonrpc: "2.0",
      method: "eth_getBlockByNumber",
      params: [`0x${parseInt(blockNumber).toString(16)}`, true],
      id: 1,
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error fetching block:", err.message);
    res.status(500).json({ error: "Failed to fetch block" });
  }
});

app.listen(ENV.PORT, () => {
  console.log(`Producer running on port ${ENV.PORT}`);
});
