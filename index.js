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
        const exclusiveServiceCollection = database.collection('exclusive-service-data');

        // POST API FOR ADD DELIVERY
        app.post('/booking', async (req, res) => {
            const newOrder = req.body;
            console.log('hitting the post', newOrder);
            const result = await deliveryCollection.insertOne(newOrder);
            console.log(result);
            res.json(result)
        })

        // POST API FOR get user own offers
        app.post('/user-offer', async (req, res) => {
            const newService = req.body;
            console.log('hitting the post', newService);
            const result = await exclusiveServiceCollection.insertOne(newService);
            console.log(result);
            res.json(result)
        })

        // get API FOR get user own offers all
        app.get('/user-offer', async (req, res) => {
            const cursor = exclusiveServiceCollection.find({});
            const getOfferData = await cursor.toArray();
            res.send(getOfferData)
        })

        // get API FOR get user own offer single by id
        app.get('/user-offer/:id', async (req, res) => {
            const id = req.params.id;
            const getOfferData = await exclusiveServiceCollection.findOne({ _id: ObjectId(id) });
            res.send(getOfferData)
        })


        // get all delivery order list
        app.get('/all-orders', async (req, res) => {
            const cursor = deliveryCollection.find({});
            const getAllOrder = await cursor.toArray();
            res.send(getAllOrder);
        })

        // get a single user delivery order history
        app.get('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { identifyUser: id };
            const service = await deliveryCollection.find(query);
            const result = await service.toArray();
            res.json(result)
        })

        // // delete a order collection
        // DELETE API
        app.delete('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await deliveryCollection.deleteOne(query);
            res.json(result);
        })

        // Update pending status (put)
        app.put('/update-order/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    orderStatus: 'approved'
                },
            };
            const result = await deliveryCollection.updateOne(filter, updateDoc, options)
            res.send(result)
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