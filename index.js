
const express = require('express')
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdjlbxg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('doctor').collection('services');
        const reviewCollection = client.db('doctor').collection('reviews');

        app.get('/service',async(req,res)=>{
            const query={};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/services',async(req,res)=>{
            const query={};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        // reviews api

        app.get('/reviews',async(req,res)=>{
            // console.log(req.query)
            let query = {};
            if(req.query.email){
                query = {
                    email:req.query.email
                }
            }
            
            const cursor = reviewCollection.find(query);
            const allReviews = await cursor.toArray();
            res.send(allReviews);
        })

        app.post('/reviews',async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        //  app.get('/services/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     const query = {_id:ObjectId(id)};
        //     const service = await serviceCollection.findOne(query);
        //     res.send(service)
        // })

        app.get('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {service:id};
            const cursor = reviewCollection.find(query).sort({_id:-1})
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        app.post('/services',async(req,res)=>{
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(error=> console.error(error))

app.get('/',(req,res)=>{
    res.send('Doctor personal website')
})
app.listen(port ,()=>{
    console.log(`Server is running on ${port}`)
})