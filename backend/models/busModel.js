import mongoose from 'mongoose'

const busSchema=mongoose.Schema({
    busNumber:{
        type:Number,
        required:true
    },
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Driver',
        default:null


    },
    route:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Route',
        default:null

    },
    model:{
        type:String,
        required:true
    },
    manufacturer:{
      type:String,
      required:true,
    },
    purchaseDate:{
      type:String,
      required:true
    },
    nextService:{
      type:Date,
        default:null
    },
    repairHistory:[
        {
            repairType:{
                type:String,
            },
            cost:{
                type:Number,
            },
            Date:{
                type:Number,
            },
            receipt:{
                type:String,
            }
        }
    ],
    driverHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Driver',
            default:null
        }
    ],
    registrationNumber:{
        type:String,
        required:true
    },
    registrationCard:{
        type:Buffer,
        required:true
    },
    fitnessReport:{
        type:Buffer,
        required:true
    },
    complaint:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Complaint',
        }
    ],
    location:{
        latitude:{
            type:String
        },
        longitude:{
            type:String
        }
    },
    photo:{
        type:Buffer,
        required:true
    },
    photoType:{
        type:String,
        required:true
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Student',
            default:null
        }
    ]
});

const Bus=mongoose.model('Bus',busSchema);
export default Bus;