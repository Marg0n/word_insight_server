const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//config
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors({
  origin: [
    // 'http://localhost:5000',
    'http://localhost:5173',
    'https://worldinsight.netlify.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());


//routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});


//connection to mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // DB Collections Connection
    const blogsCollection = client.db("wordinsightDB").collection("blogs");
    const commentsCollection = client.db("wordinsightDB").collection("comments");
    const wishlistsCollection = client.db("wordinsightDB").collection("wishlists");


    // Get all data from blogs
    app.get('/allBlogs', async (req, res) => {
      const cursor = blogsCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    })

    //  Get blog details data by id
    app.get('/allBlogs/:id', async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const results = await blogsCollection.findOne({ _id: new ObjectId(id) });
      // console.log(results);
      res.send(results);
    });

    // Post data for add blog
    app.post('/addBlog', async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const result = await blogsCollection.insertOne(newBlog);
      res.send(result);
    })

    // Get all data from wishlist
    app.get('/allWishlists', async (req, res) => {
      const cursor = wishlistsCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    })

    
    //  Get data by email holder from wishlists collection
    app.get('/allWishlists/:email', async (req, res) => {
      // console.log(req.params.email);
      const mail = req.params.email;
      const results = await wishlistsCollection.find({ userMail: mail }).toArray();
      res.send(results);
    });

    //  Get data by name holder from wishlists collection
    app.get('/allWishlist/:name', async (req, res) => {
      // console.log(req?.params?.name);
      const name = req?.params?.name;
      const results = await wishlistsCollection.find({ userName: name }).toArray();
      // console.log(results)
      res.send(results);
    });

    // Post data for add wish list
    app.post('/addWishlist', async (req, res) => {
      const newBlog = req.body;
      // console.log(newBlog);
      const result = await wishlistsCollection.insertOne(newBlog);
      res.send(result);
    })

    // delete wishlist data
    app.delete('/deleteWishlist/:id', async (req, res) => {
      const id = req.params.id;
      const result = await wishlistsCollection.deleteOne({ _id: new ObjectId(id) });
      // console.log(result);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
