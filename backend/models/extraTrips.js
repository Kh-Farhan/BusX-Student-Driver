import * as mongoose from "mongoose";

const tripSchema =mongoose.Schema({
    destination:{
        type:String,
    },
    hiredBy:{
        type:String
    },
    hireDate:{
        type:Date
    },
    numberOfDays:{
        type:Number
    },
    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus'
    },
    Driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Driver'
    },
    institute:{
        type:String,
        required:true
    }
})
