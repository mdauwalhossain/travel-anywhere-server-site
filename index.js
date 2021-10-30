const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const cors = require('cors');

const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imuoa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        console.log('Database connected successfully');
        const database = client.db('online_shop');
        const productCollection = database.collection('products');

        //  Get products API
        app.get('/products', async(req, res) =>{
             const cursor = productCollection.find({});
            //  const cursor = await productCollection.find({}).toArray();
            const product = await cursor.toArray();
            console.log(product);
            res.send(product);

        });

        // POST API
        app.post('/products', async(req, res) =>{
            const newUser = req.body;
            const result = await productCollection.insertOne(newUser);
            console.log('hit the post', req.body);
            console.log('added user', result);
            res.send(result)
        });

        // Delete API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            console.log('Deleted id', result);
            res.json(result)
        })
        
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Travel Anywhere Server running');
});

app.listen(port, () => {
    console.log('Server Running Properly', port);
})