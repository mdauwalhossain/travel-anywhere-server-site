const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config();
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
            const cursor =await productCollection.find({}).toArray();
            // const products = await cursor.toArray();
            // console.log(products);
            res.send(products);

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