import mongoose from "mongoose";
const {Schema , model} = mongoose;

const historySchema = new Schema ({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    prompt :{
        type: String,
        required : true
    }
    
});


const History = model('History', historySchema);

export default History;


