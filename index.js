const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.akira.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const todoCollection = client.db('todo-app').collection('all_tasks');

        app.get('/tasks', async(req, res) =>{
            console.log('hello');
            const tasks = await todoCollection.find().toArray();
            res.send(tasks);
        })

        app.get('/mytask', async (req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const myTasks = await todoCollection.find(query).toArray();
            res.send(myTasks);
        })
        app.put('/mytask/:id', async (req, res)=> {
            const id = req.params.id;
            const email = req.body.email;
            console.log(id, email)
            const filter = {_id: ObjectId(id)};
            const options = {upsert : true};
            const updateDoc = {
                $set : {
                    email : email
                },
            }
            const myTask = await todoCollection.updateOne(filter, updateDoc, options);
            res.send(myTask)
        })

        app.delete('/mytask/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        })

        
    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('todo app server site running')
});

app.listen(port, ()=>{
    console.log('Listening', port);
})