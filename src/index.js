const serverless = require("serverless-http");
const express = require("express");
const { neon, neonConfig } = require("@neondatabase/serverless")
const app = express();

async function dbClient() {
  // for http connections
  // non-pooling
  neonConfig.fetchConnectionCache = true
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

app.get("/", async (req, res, next) => {
  const db = await dbClient();

  const [results] = await db`select now();`
  
  return res.status(200).json({
    message: "Hello from root!",
    results: results.now,
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
