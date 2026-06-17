const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    }, 
    
    receiver: {
        type: String,
      required: true,
    },

    amount: {
        type: Number,
      default: 0
    },

    status: {
        type: String,
      required: true
    }
},
    {timestamps : true}
)