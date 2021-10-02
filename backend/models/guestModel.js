import mongoose from 'mongoose'

const guestSchema=mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    regNo:{
        type:String,
        required: true
    },
    contact:{
        type:Number,
        required:true
    },
    destination:{
        type:String,
        required: true
    }
})

const Guest = mongoose.model('Guest', guestSchema)

export default Guest;
