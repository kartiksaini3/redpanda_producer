import axios from "axios";
import { produceMessage } from "../utils/functions.js";

export const getBlocks = async (limit, res, producer, rpcUrl) => {
  try {
    // fetch latest block height
    const statusRes = await axios.post(rpcUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "status",
      params: [],
    });

    const latestHeight = +statusRes.data.result.sync_info.latest_block_height;
    await produceMessage(producer, "latest_block_number", `${latestHeight}`);

    let startHeight = 1;
    startHeight = limit
      ? Math.max(latestHeight - limit + 1, startHeight)
      : startHeight;

    for (let height = startHeight; height <= latestHeight; height++) {
      // fetch block info

      const blockRes = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: height,
        method: "block",
        params: { height: `${height}` },
        // params: { height: `1449399` },
      });
      if (blockRes?.data?.error) throw new Error();
      await produceMessage(
        producer,
        "block_info",
        JSON.stringify(blockRes?.data)
      );
      await produceMessage(producer, "current_block_number", `${height}`);
    }
    res.json({ message: "Blocks produced" });
  } catch (err) {
    console.error("Error fetching blocks:", err.message);
    res.status(500).json({ error: "Failed to fetch blocks" });
  }
};
