import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const superAdminSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },


},{timeStamps:true})

superAdminSchema.methods.matchPassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

superAdminSchema.pre('save',async function(next){
    const user=this;
    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password, 8)
    }
    next()
})

const SuperAdmin=mongoose.model('superadmin',superAdminSchema);

export default SuperAdmin;