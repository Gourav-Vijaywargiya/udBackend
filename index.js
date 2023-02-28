const connectToMongo = require('./db');

const express = require('express');

const app = express();

var cors = require('cors');

app.use(express.json());

const path = require('path');
app.use("/uploads", express.static("/home/bs/udBackend/uploads"));

connectToMongo();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

  app.use(cors({
    origin: `${process.env.CLIENT_URL}`
  }))

app.use('/data',require('./routes/data'));

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`)
})



