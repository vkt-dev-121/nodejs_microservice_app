const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const app = express();

app.use(express.json());

// Connect to moongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, })
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));

// product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String
})

const Product = mongoose.model('Product',productSchema)

// Routes
app.get('/products', async (req,res) => {
    const product = new Product(req.body);
    await product.save();

    res.status(201).send(product);
})

app.get('/product/:id', async (req,res) => {
    const product =  await Product.findById(req.params.id);
    res.send(product)

    // res.status(201).send(user);
})

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`)
})