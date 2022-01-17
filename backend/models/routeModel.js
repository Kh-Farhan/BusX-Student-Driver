import mongoose from 'mongoose'

const routeSchema=mongoose.Schema({
    name:{
        type:Number,
        required:true,
    },
    stops:[
        {
            lat:{
                type:Number,
                required:true
            },
            lng:{
                type:Number,
                required:true
            }
        }
    ],
    distance:{
        type:Number,
        required:true
    },
    traveltime:{
        type:Number,
        required:true
    },
    addresses:[
        {
                type: String,
                required: true
        }
    ],
    institute:{
        type:String,
        required:true
    }
})
routeSchema.index({ 'institute': 1, 'name': 1}, { unique: true });
const Route =mongoose.model('Route', routeSchema)
export default Route;
