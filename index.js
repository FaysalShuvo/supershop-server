const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello superShop!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbqng.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const itemsCollection = client.db("supershop").collection("items");

    app.get("/items", (req, res) => {
        itemsCollection.find().toArray((err, items) => {
          res.send(items)
      })
  })
    app.post("/addItem", (req, res) => {
    const newItem = req.body;
    console.log(newItem);

    itemsCollection.insertOne(newItem).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
