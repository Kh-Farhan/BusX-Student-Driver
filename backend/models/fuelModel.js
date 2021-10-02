import mongoose from "mongoose";

const fuelSchema= mongoose.Schema({
    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus'
    },
    fuelHistory:[
        {
            cost:{
                type:Number,
                required:true
            },
            date:{
                type:Date,
                required:true
            }
        }
    ]
})

const Fuel= mongoose.model('Fuel',fuelSchema)

export default Fuel
