require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`
        },
        timeout: 10000
      }
    );
    console.log("Log success");
  } catch (err) {
    console.log("Logging issue:", err.code || err.message);
  }
}

app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Root API called");
  res.send("Server running");
});

app.get("/test", async (req, res) => {
  await Log("backend", "debug", "handler", "Test route hit");
  res.send("Test OK");
});

app.get("/error", async (req, res) => {
  await Log("backend", "error", "handler", "Manual error triggered");
  res.status(500).send("Error route working");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});