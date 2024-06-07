const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzmtgtr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const productDetails = client.db('productDB').collection('product');
    const cartDetails = client.db('productDB').collection('cart');
    const userDetails = client.db('productDB').collection('user');
  
  
   
    app.get('/products', async(req, res ) =>{
        const result = await productDetails.find().toArray();
        res.send(result)
    })
   
    // carts collection
    app.get('/dashBoard/cart', async(req, res) =>{
      const email =req.query.email;
      console.log(email)
      if(!email){
        return res.send([])
      }
      const query = {email: email}
      const result= await cartDetails.find(query).toArray();
      console.log(result)
      res.send(result)
    })
    app.post('/dashBoard/cart', async (req, res)=>{
      const item = req.body;
      console.log(item);
      const result = await cartDetails.insertOne(item);
      res.send(result)
    })
   

    app.delete('/dashBoard/cart/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log(id)
      const result = await cartDetails.deleteOne(query);
      res.send(result);
    })

    // userCollection
    app.get('/dashBoard/user',  async(req, res)=>{
      const result = await userDetails.find().toArray();
      res.send(result)
    })
   
    app.post('/dashBoard/user', async(req, res)=>{
      const user = req.body;
      const query ={email:user.email};
      const existingUser = await userDetails.findOne(query)
      if(existingUser){
        return res.send({message:"user already exist"})
      }
      const result = await userDetails.insertOne(user)
       res.send(result)
    })
    
    app.delete('/dashBoard/user/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log(id)
      const result = await userDetails.deleteOne(query);
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




app.get('/', (req, res)=>{
    res.send('decorate your house')
})

app.listen(port, () =>{
    console.log(`we are here to help${port}`)
})

