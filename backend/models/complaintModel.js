import mongoose from 'mongoose'

const complaintSchema=mongoose.Schema({
    subject:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    }
})

const Complaint = mongoose.model('Complaint', complaintSchema)

export default Complaint;
