const http = require("http");
const url = require("url");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/api/v1/weather", async (req, res) => {
  const params = new url.URLSearchParams(req.query);
  try {
    const axiosRes = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?${params}&units=metric&appid=${process.env.API_KEY}`
    );

    const data = axiosRes.data;
    const list = data.list.filter((date) => {
      return /^\d{4}-\d{2}-\d{2} (09|18):00:00$/.test(date.dt_txt);
    });
    res.status(200).json({ city: data.city, list });
  } catch (err) {
    res.status(400).json({ message: "bad request" });
  }
});

app.listen(process.env.PORT || 8081, () => {
  console.log("Running");
});
