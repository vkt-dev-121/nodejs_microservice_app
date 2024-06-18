const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const amqp = require('amqplib/callback_api')

dotenv.config();

const app = express();

app.use(express.json());

// Connect to moongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, })
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));

// user Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const User = mongoose.model('User',userSchema)

// Routes
function publishToQueue(queueName, data){
    amqp.connect('amqp://rabbitmq', (err,conn) => {
        conn.createChannel((err,ch) => {
            ch.assertQueue(queueName, { durable: false });
            ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        })
    })
}
app.get('/users', async (req,res) => {
    const user = new User(req.body);
    await user.save();
    publishToQueue('user_created',user)
    res.status(201).send(user);
})

app.get('/user/:id', async (req,res) => {
    const user =  await User.findById(req.params.id);
    res.send(user)

    // res.status(201).send(user);
})

// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`)
})