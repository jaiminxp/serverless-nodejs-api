const serverless = require("serverless-http");
const express = require("express");
const AWS = require("aws-sdk");
const { neon, neonConfig } = require("@neondatabase/serverless")

const AWS_REGION = "us-east-1";
const STAGE = process.env.STAGE || "prod";

const ssm = new AWS.SSM({
  region: AWS_REGION,
});

const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`

async function dbClient() {
  // for http connections
  // non-pooling

  const paramStoreData = await ssm.getParameter({
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  }).promise();

  neonConfig.fetchConnectionCache = true
  const sql = neon(paramStoreData.Parameter.Value);
  return sql;
}

const app = express();

app.get("/", async (req, res, next) => {
  const db = await dbClient();

  const [dbNow] = await db`select now();`
  const delta = (Date.now() - dbNow.now.getTime()) / 1000;

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
