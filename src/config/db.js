const mongoose = require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected Successfully!");
    }
    catch(error){
        console.log("There seems to be an error: ", error);
    }
}

module.exports = connectDB;