const express = require('express');

const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.in1rose.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db('to-doDB').collection('user')
    const taskCollection = client.db('to-doDB').collection('task')

    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    //   task API
    app.get('/task', async (req, res) => {
      const result = await taskCollection.find().toArray();
      res.send(result);
    })

    app.get('/task/:id', async (req, res) => {
      const email = req.params.id
      const query = {email : email }
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })
    app.post('/task', async (req, res) => {
      const newTask = req.body
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    })
    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.findOne(query);
      res.send(result);
    })

    app.patch('/tasks/:id', async (req, res) => {
      const task = req.body
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          deadline: task.deadline,
          description: task.description,
          project: task.project,
          projectName: task.projectName,
          project_description: task.project_description,
          status: task.status,
          title: task.title,
          urgency: task.urgency,
        }
      }
      const result = await taskCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('to-do is waiting')
})


app.listen(port, () => {
  console.log(`To-Do list is active on port ${port}`);
})