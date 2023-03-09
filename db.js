const mongoose = require('mongoose');

require('dotenv').config();

mongoose.set('strictQuery', true);

// fucntion to connect to the database
const connectToMongo =() =>{
   mongoose.connect(process.env.mongoURI,()=>{
        console.log("Connected to Mongo successfully");
    })
}


module.exports = connectToMongo;