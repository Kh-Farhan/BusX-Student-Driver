import mongoose from 'mongoose'

const complaintSchema=mongoose.Schema({
    subject:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    date:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    institute:{
        type:String,
        required:true
    }
})
const Complaint = mongoose.model('Complaint', complaintSchema)

export default Complaint;
