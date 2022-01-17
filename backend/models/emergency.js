import mongoose from "mongoose";

const emergencySchema= mongoose.Schema({
    issue:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    photo1:{
        type:Buffer,
         required:true,
    },
    photo2:{
        type:Buffer,
         required:true,
    },
     photoType:{
       type:String,
       required:true,
       default:"image/jpg"
    },
    opened:{
        type:Boolean,
        default:false
    },
    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus',
        required:true
    },
    currentLocation:{
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    },
})

const Emergency= mongoose.model('Emergency',emergencySchema)

export default Emergency
