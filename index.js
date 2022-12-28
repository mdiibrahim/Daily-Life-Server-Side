const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@daily-life.7t6of0n.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('daily-life').collection('users');
        const tasksCollection = client.db('daily-life').collection('tasks');
        app.post('/users', async (req, res) => {
            const user = req.body;
            
            const copiedUser = await usersCollection.findOne(user);
            if (!copiedUser) {

                res.send(await usersCollection.insertOne(user));
            }
            res.status(200).send({ acknowledged: 'successfull' })
            
            
        });
        app.post('/tasks', async (req, res) => {
            const tasks = req.body;
            const result = await tasksCollection.insertOne(tasks);
            res.send(result);
        });
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const low = query.email?.toLocaleLowerCase();
            const tasks = await tasksCollection.find({}).toArray();
            // console.log(tasks)
            const filter = tasks.filter(task => {
                console.log(low)
                if (task.email === low ) {
                    return task;
                }
            })
            res.send(filter)
        })
        app.get('/tasks/my-tasks/:id', async (req, res) => {
            const id = req.params.id;
            
            const filter = { _id: ObjectId(id) };
            const task = await tasksCollection.findOne(filter);
            console.log(task)
            res.send(task);
        })
    }
    finally {

    }
}
run().catch(console.log);




app.get('/', async (req, res) => {
    res.send('Daily Life server is running');
})

app.listen(port, () => console.log(`Daily Life running on ${port}`))