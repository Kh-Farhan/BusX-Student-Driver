import mongoose from 'mongoose'

const licenseSchema=mongoose.Schema({
    institute:{
        type:String,
        required:true,
        unique:true
    },

    licenseDate:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymentDate:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }

})


const License =mongoose.model('License', licenseSchema)
export default License;