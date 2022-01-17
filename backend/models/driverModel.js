import mongoose from 'mongoose'

const driverSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        default:'12345',

    },
    cnic:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    dob:{
      type:String,
      required:true,
    },
    contact:{
        type:Number,
        required:true
    },
    photo:{
        type:Buffer,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    address:{
      type:String,
      required:true
    },
    postalCode:{
        type:Number,
        required:true
    },
    photoType:{
      type:String,
      required:true
    },
    complaints:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Complaint'
        }
    ],
    fines:[
        {
            reason:{
                type:String,
            },
            location:{
                latitude:{
                    type:Number
                },
                longitude:{
                    type:Number
                }
            },
            amount:{
                type:Number
            },
        }
    ],
    license:{
        type:Buffer,
        required:true
    },

    currentLocation:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    },
    institute:{
        type:String,
        required:true
    }

})

driverSchema.index({ 'institute': 1, 'cnic': 1}, { unique: true });


driverSchema.pre('save',async function (next){
    const user=this;
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }
    next()
})

const Driver =mongoose.model('Driver',driverSchema)

export default Driver
