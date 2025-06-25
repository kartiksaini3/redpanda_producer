import "dotenv/config";

export const ENV = {
  PORT: +process.env.PORT || 3000,
  RPC_URL: process.env.RPC_URL,
};
