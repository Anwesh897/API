const express = require("express");
const fs = require("fs");
const request = require("request");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    msg: "Do not go gentle into that good night"
  });
});

const apikey = process.env.alphacoderkey;
app.post("/images", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      request(
        {
          //url
          url: ` https://wall.alphacoders.com/api2.0/get.php?auth=${apikey}&method`
        },
        (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return res
              .status(500)
              .json({ type: "error", message: err.message });
          }
          const data = JSON.parse(body).wallpapers[0];
          res.json({
            data: data,
            user: authData
          });
        }
      );
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "Anwesh",
    password: "anwesh96"
  };
  jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({ token });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(1234, () => console.log("server is running on port 1234"));
