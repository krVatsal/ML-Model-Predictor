import mongoose from "mongoose";
const {Schema , model} = mongoose;

const chatSchema = new Schema({
    prompt :{
        type: String,
        required : true
    },
    traingData : {
        type: String
    },
    code:{
        type: String,
        required : true
    },
    steps:{
        type: Array,
        required : true
    },
    dataSet:{
        type: Array,
        required : true
    }
})

const historySchema = new Schema ({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    chat: [chatSchema],

    
});


const History = model('History', historySchema);

export default History;


