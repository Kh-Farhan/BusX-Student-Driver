import mongoose from 'mongoose'

const feedbackSchema=mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    description:{
        type:String,
        required: true
    },
    institute:{
        type:String,
        required:true
    },
})

const Feedback = mongoose.model('Feedback',feedbackSchema)

export default Feedback;