const serverless = require("serverless-http");
const express = require("express");
const { getDbClient } = require("./db/clients");
const crud = require("./db/crud");
const validtors = require("./db/validators");

const app = express();

app.use(express.json());

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

app.get("/leads", async (req, res, next) => {
  const result = await crud.listLeads()

  return res.status(200).json({
    results: result
  });
});

app.get("/leads/:id", async (req, res, next) => {
  const result = await crud.getLead(req.params.id)

  return res.status(200).json({
    result
  });
});

app.post("/leads", async (req, res, next) => {
  const body = await req.body
  const { data, hasError, message } = validtors.validateLead(body)

  if (hasError) {
    return res.status(400).json({
      message
    });  
  } else if(hasError === undefined) {
    return res.status(500).json({
      message: "Server Error"
    });  
  }

  const result = await crud.newLead(body)

  return res.status(200).json({
    message: "Lead created",
    result: result
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
