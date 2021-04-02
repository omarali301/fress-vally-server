const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT ||8000

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rpizr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const ShopCollection = client.db("freshValley").collection("products");
  // perform actions on the collection object


  app.get('/shopProducts', (req, res) => {
  ShopCollection.find()
  .toArray((err, items) =>{
    console.log('from database',items);
    res.send(items)
  })
})

  app.post('/addProduct', (req, res) =>{
    const newProduct =req.body;
    console.log('adding new products :', newProduct);
    ShopCollection.insertOne(newProduct)
    .then(result =>{
      console.log('inserted count', result.insertedCount)
    res.send(result.insertedCount > 0)
    })
  })
  // client.close();
});



app.listen(port)