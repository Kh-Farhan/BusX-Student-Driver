import mongoose from 'mongoose'

const paymentSchema=mongoose.Schema({
    institute:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'License',
        required:true
    },
    paymentType:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    paymentDate:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }

},{timeStamps:true})

const Payment=mongoose.model('Payment',paymentSchema);

export default Payment;