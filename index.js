const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stv3jdc.mongodb.net/?retryWrites=true&w=majority`;


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
    await client.connect();

    const roomCollection = client.db("roomDB").collection("rooms")
    const bookingCollection = client.db("roomDB").collection("bookings")
    const reviewCollection = client.db("roomDB").collection("review")

    // read
    // room

    app.get('/rooms', async (req, res) => {
      const cursor = roomCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // booking related

    // find

    app.get('/bookings/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.send(result)

    })

    // update

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateBooking = req.body;
      const update = {
        $set: {
          date: updateBooking.date,

        }
      }
      const result = await bookingCollection.updateOne(filter,update,options)
      res.send(result)
    })


    // read

    app.get('/bookings', async (req, res) => {

      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const cursor = bookingCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })






    // create

    app.post('/bookings', async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking)
      res.send(result)

    })


    // for review

    app.post('/review', async(req,res)=>{
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview)
      res.send(result)
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
  res.send("Hotel Booking server is running")
})

app.listen(port, () => {
  console.log(`Hotel Booking server is running on PORT:${port} `)
})