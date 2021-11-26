const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boe0w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database')

        const database = client.db("frameTravellers");

        const packageCollection = database.collection("packages");



        const orderCollection = database.collection("orders");

        //basic server checking
        app.get('/', async (req, res) => {
            res.send('hello from the server');
        })

        //get all package checking
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});

            const packages = await cursor.toArray();

            res.send(packages);
        })
        //get all orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});

            const orders = await cursor.toArray();

            res.send(orders);
        })

        //Filtered Order Get Api
        // email:"0009shaon@gmail.com"
        app.post('/filtered', async (req, res) => {
            console.log(req.body);
            // const id = req.params.id;
            const query = { email: "0009shaon@gmail.com" };
            const service = orderCollection.find(query)
            const orders = await service.toArray();
            res.send(orders);
        })
        app.get('/filtered', async (req, res) => {
            // console.log(req.body);
            // // const id = req.params.id;
            const query = { email: "0009shaon@gmail.com" };
            const service = orderCollection.find(query)
            const orders = await service.toArray();
            res.send(orders);
        })
        //POST API
        app.post('/packages', async (req, res) => {
            const service = req.body;
            console.log('post hitted', service);

            const result = await packageCollection.insertOne(service);

            console.log(result);
            res.json(result);
        })
        //POST API
        app.post('/orders', async (req, res) => {
            const service = req.body;
            // console.log('post hitted', service);
            service.status = 'pending';
            console.log(service);
            const result = await orderCollection.insertOne(service);

            console.log(result);
            res.json(result);
        })
        //Single Service Get Api
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await packageCollection.findOne(query)
            res.send(service);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await orderCollection.findOne(query)
            res.send(service);
        })
        app.get('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await orderCollection.findOne(query)
            res.send(service);
        })
        //DELETE API
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await packageCollection.deleteOne(query);
            res.json(result);
        })
        //DELETE API
        app.delete('/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        //update/put function
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // const newOrderStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'confirmed'

                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            console.log('will be updating', id, result, updateDoc)
            res.json(result);
        })

    }
    finally {

    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('listening to port: ', port);
})