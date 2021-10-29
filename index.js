// user: delivery-all-data
//  pass: v2yIdbPoAXQitaMY
const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.npegz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('deliveryServiceAllData');
        const deliveryCollection = database.collection('delivery-order-data');

        // POST API FOR ADD DELIVERY
        app.post('/booking', async (req, res) => {
            const newOrder = req.body;
            console.log('hitting the post', newOrder);
            // const result = await deliveryCollection.insertOne(newOrder);
            // console.log(result);
            res.send('hitted') 
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Delivery Server')
});
app.listen(port, () => {
    console.log('Running Delivery Server on port ', port);
})