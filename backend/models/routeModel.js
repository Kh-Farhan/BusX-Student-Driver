import mongoose from 'mongoose'

const routeSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    stops:[
        {
            latitude:{
                type:String
            },
            longitude:{
                type:String
            }
        }
    ],
    bus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus',
    }
})

const Route =mongoose.model('Route', routeSchema)
export default Route;
