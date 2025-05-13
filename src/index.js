const serverless = require("serverless-http");
const express = require("express");
const { getDbClient } = require("./db/clients");

const app = express();

app.get("/", async (req, res, next) => {
  const db = await getDbClient();

  const [dbNow] = await db`select now();`
  const delta = (dbNow.now.getTime() - Date.now()) / 1000;

  return res.status(200).json({
    message: "Hello from root!",
    delta,
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
