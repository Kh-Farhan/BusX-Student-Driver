import Student from '../models/studentModel.js';
import Route from '../models/routeModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Bus from '../models/busModel.js';
import License from '../models/licenseModel.js';
import Complaint from "../models/complaintModel.js";
import Feedback from '../models/feedBackModel.js';
import nodemailer from 'nodemailer';
import geodist from 'geodist';
import randomstring from 'randomstring';
const saltRounds = 10;


const indexFunction = (req, res, next)=>{
    console.log("here")
    res.send("INDEX")
};
const loginFunction =async (req, res, next)=>{
    console.log("here in Login Controller")
    const {email,password}=req.body;
    const existingStudent=await Student.findOne({email});
    
   if(!existingStudent){
       res.status(404).json({message:"Invalid Email,User Not found!"});
   }
   if(password){
    const Hpassword=await bcrypt.compare(password,existingStudent.password);
    if(Hpassword){
     const token=jwt.sign({email:existingStudent.email,_id:existingStudent._id},"test",{expiresIn:"1h"});
     License.findOne({institute:existingStudent.institute},(err,userInfo)=>{
        let years=parseInt(userInfo.type.charAt(0))
        let days=feeStatus(userInfo.paymentDate)-1
        let status=(days <= (365 * years));
        if(status){
            res.status(200).json({result:existingStudent,token});
        }
        else{
            res.status(200).json({error:"Not Allowed"});
        }
     })   




     

    }
    else{
     res.status(404).json({message:"invalid Password!"});
    }
   }
   else{
    res.status(404).json({message:"Re Entre Password!!"});
   }
   
};
const feeStatus=(date)=>{
    date= new Date(date)
    let today= new Date()
    return Math.round((today-date)/(1000*60*60*24));
  }
const checkDefaulter=()=>{
    let years=parseInt(userInfo.license.type.charAt(0))
    let days=feeStatus(userInfo.license.paymentDate)-1
    return (days <= (365 * years))
  }
const getRouteFunction=async(req,res)=>{
    console.log(req.params.ins);
    const data=await Route.find({institute:req.params.ins});
    if(data){
        console.log(data);
        res.status(200).json({routes:data});
    }else{
        res.status(404).json({message:"No routes Found"});
    }
}
const getOneRouteFunction=async(req,res)=>{
    const data=await Route.findById(req.params.id);
    if(data){
        res.status(200).json({route:data});
    }else{
        res.status(404).json({message:"No route Found"});
    }
}
const getBus=async(req,res)=>{
    const data=await Bus.findOne({_id:"60afaf0adf5c3a5ceefa11fc"});
    if(data){
        res.status(200).send(data);
    }else{
        res.status(404).json({message:"No routes Found"});
    }
}

const getDataFunction=async(req,res)=>{
    console.log(req.query.user);
    console.log(req.query.institute);
    const data=await Student.findOne({_id:req.query.user,institute:req.query.institute});
    if(data){
        res.status(200).json({data:data});
    }else{
        res.status(404).json({message:"No Data Found"});
    }
}
const changeRouteFunction=async(req,res)=>{
    const data=req.body;
    console.log(data);
    const newBus=await Bus.findOne({route:mongoose.Types.ObjectId(req.body.route),institute:req.body.institute});
    console.log(newBus);
    if(newBus===null){
        res.status(404).json({Errormessage:"No Bus Assigned to this route yet!"});
    }
    const data1=await Student.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.body.user),institute:req.body.institute},{route:{routeId:req.body.route,routeName:req.body.name},bus:newBus._id},{useFindAndModify:false})
    console.log("updated St Data:");
    if(data1){
        console.log("student updated!!");
            if(req.body.isRoute!==null){
            Bus.findOne({_id:data.current},(err,dat)=>{
                console.log("bus found"+dat);
                if(!err){
                    if(dat.students){
                        console.log(dat.students);
                    let students=dat.students;
                    students=students.filter((item)=>item===req.body.user);
                        console.log("after Deleting :"+students);
                    const bus2=Bus.findOneAndUpdate({_id:data.current},{students:students},{new:true,useFindAndModify:false},(err,data)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("deleted");
                        }
                    });
                    console.log("after Updating: "+bus2);
                }}
                if(err){
                    console.log("error getting current Bus");
                }
            });
            const bus=Bus.findOne({_id:newBus._id},(err,bus)=>{
                if(err){
                    res.status(200).json({Successmessage:"No Buss!"});
                }
                else{
                        let studentsInBus=bus.students;
                        studentsInBus=[...studentsInBus,mongoose.Types.ObjectId(req.body.user)];
                        const updated=Bus.updateOne({_id:bus._id},{students:studentsInBus},(err,data)=>{
                            if(err){
                                res.status(200).json({Successmessage:"Student Not Added to Bus!"});
                            }
                            else{
                                res.status(200).json({Successmessage:"Change Successful!"}); 
                            }
                        });
                }
            });
        }else{
            const bus=Bus.findOne({_id:newBus._id},(err,bus)=>{
                if(err){
                    res.status(200).json({Successmessage:"No Buss!"});
                }
                else{
                        let studentsInBus=bus.students;
                        studentsInBus=[...studentsInBus,mongoose.Types.ObjectId(req.body.user)];
                        const updated=Bus.updateOne({_id:data.bus},{students:studentsInBus},(err,data)=>{
                            if(err){
                                res.status(200).json({Successmessage:"Student Not Added to Bus!"});
                            }
                            else{
                                res.status(200).json({Successmessage:"Route Set Successfully!"}); 
                            }
                        });
                }
            }); 
        }
    
    }else{
        res.status(404).json({Errormessage:"Not Updated! Something went wrong!"});
    }
};

const getAttendence=async(req,res)=>{
    const data=await Student.findOne({_id:req.params.id});
    if(data){
        res.status(200).json({attendence:data.attendence});
    }else{
        res.status(404).json({message:"No Student Found"});
    }
}
const setAttendence=async(req,res)=>{
    console.log(req.body.attendence);
    if(req.body.attendence!==undefined){
    const data=await Student.findOneAndUpdate({_id:req.body.id},{attendence:req.body.attendence},{new:true,useFindAndModify:false});
    if(data){
        console.log("attendence updated");
        res.status(200).json({attendence:data.attendence});
    }else{
        console.log("Error")
        res.status(404).json({message:"Attendence Not Updated"});
    }}
    else{
        const data=await Student.findOne({_id:req.body.id});
    if(data){
        console.log("attendence updated");
        res.status(200).json({attendence:data.attendence});
    }
    }
};

const setNearby=async(req,res)=>{
    const data=await Student.findOneAndUpdate({_id:req.body.id,institute:req.body.institute},{nearbyAlert:{latitude:req.body.coordinates.latitude,longitude:req.body.coordinates.longitude}},{new:true,useFindAndModify:false});
    if(data){
        res.status(200).json({Success:"Successfully Updated !!!"});
    }else{
        res.status(404).json({message:"No Student Found"});
    }
}
const setStop=async(req,res)=>{
    
    const data=await Student.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.body.id)},{stop:{latitude:req.body.coordinates.latitude,longitude:req.body.coordinates.longitude}},{new:true,useFindAndModify:false});
    console.log(data)
    if(data){
        res.status(200).json({Success:"Successfully Updated !!!"});
    }else{
        res.status(404).json({message:"No Student Found"});
    }
}
const complainFunction=(req,res)=>{
    if(req.body){
    var comp = new Complaint(req.body);

    comp.save(function(err, doc) {
      if (err) {
           console.error(err);
           res.status(404).json({message:"Error Filing complain!!!"});
        }
        if(doc){
            res.status(200).json({Success:"Complaint Filed !!!"});
        }
      
    });
}
}
const feedbackFunction=(req,res)=>{
    console.log(req.body.id)
    if(req.body){
    var fb = new Feedback({description:req.body.description,sender:req.body.id,institute:req.body.institute});

    fb.save(function(err, doc) {
      if (err) {
           console.error(err);
           res.status(404).json({message:"Error Sending Feedback!!!"});
        }
        if(doc){
            res.status(200).json({Success:"Feedback Sent!!!"});
        }
      
    });
}
}
const sendEmail=async (req,res)=>{
    if(req.body.email){
       const data=Student.findOne({email:req.body.email})
       if(data){
        let token=randomstring.generate(50);
        Student.findOneAndUpdate({email:req.body.email},{$set:{forgetPasswordLink:token}},{useFindAndModify:false},(error,data)=>{
            token=token+":"+data._id;
            console.log(token);
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                  user: "busx2021@gmail.com",
                  pass: "SP18-BCS-076"
                }
              });
            let info =  transporter.sendMail({
              from: 'busX2021@gmail.com', 
              to: req.body.email, 
              subject: "Password Reset!!!", 
              text: "Hello User ",
              html: `<b>Please Click on the link to set a new Password!</b>
              <a href=http://192.168.10.6:5000/student/resetPass/${token}>Reset Password</a>
              `,
            });
            if(info){
                console.log("Message sent: %s", req.body.email);
                res.status(200).json({message:"Mail sent!"});
            }
        });
        
        
    }else{
        res.status(404).json({error:"No Student Found"});
    }
}
}
const resetPass=(req,res)=>{
    const [newtoken,id]=req.params.token.split(":");
    console.log(newtoken);
    console.log(id);
    Student.findById(id,(error,data)=>{
        if(data.forgetPasswordLink===newtoken){
            res.send(200).json({message:"Success"})
        }else{
            res.send(200).json({message:"Invalid User"})
        }

    })
}

const changePass=async (req,res)=>{
    console.log("id is:" +req.body.id);
    console.log(req.body.oldPass);
    const stud=await Student.findById(req.body.id)
    console.log("pass in db: "+stud.password)
    if(stud){
        const Hpassword=await bcrypt.compare(req.body.oldPass,stud.password);
        if(Hpassword){
            if(req.body.password===req.body.repassword){
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    Student.findOneAndUpdate({_id:req.body.id},{$set:{password:hash}},{useFindAndModify:false},(error,data)=>{
                        if(error){
                            res.status(404).json({message:"Error Updating Passowrd!!"});
                        }
                        if(data){
                            res.status(200).json({Success:"Password Updated!!"});
                        }
                    })
                });
                
            }
            else{
                res.status(404).json({message:"Passwords does not match!!"});
            }
        }
        else{
            res.status(404).json({message:"Incorrect Old Password!!"});
        }
    }
}
const selRoute=async(req,res)=>{
    let minDist=null;
    let closeStop=[];
    let closeRoute=0;
    let buss=0
    if(req.body){
        const currLoc={lat:req.body.lat,lon:req.body.lon};
        Route.find({},async(error,data)=>{
            if(!error){
                data.forEach((el,index)=>{
                    el.stops.forEach((el2,ind)=>{
                        el2=el2.toObject();
                        const stop={lat:el2.lat,lon:el2.lng};
                        const dist=geodist(stop,currLoc,{unit:"meters"});
                        console.log(dist);
                        if(minDist===null){
                            minDist=dist;
                        }else{
                            if(dist<minDist){
                                minDist=dist;
                                closeRoute={routeId:el._id,routeName:el.name};
                                closeStop={latitude:el2.lat,longitude:el2.lng};
                            }
                        }
                        
                        
                    })
                });
                console.log(minDist);
                const newBus=await Bus.findOne({route:mongoose.Types.ObjectId(closeRoute.routeId)});
                console.log(newBus);
                if(newBus===null){
                    res.status(404).json({Errormessage:"No Bus Assigned to this route yet!"});
                }
                else{
                    buss=newBus._id;
                }
                Student.findOneAndUpdate({_id:req.body.student},{$set:{stop:closeStop,route:closeRoute,bus:buss,nearbyAlert:closeStop}},{new: true,useFindAndModify:false},(error,data)=>{
                    if(data){
                        const student=data;
                        console.log("Here Student Side is Set!");
                        Bus.findOne({_id:mongoose.Types.ObjectId(buss)},(error,data1)=>{
                    if(data1){
                        let studentsInBus=data1.students;
                        studentsInBus=[...studentsInBus,mongoose.Types.ObjectId(req.body.student)];
                        console.log("Students:"+studentsInBus);
                        const updated=Bus.updateOne({_id:mongoose.Types.ObjectId(buss)},{students:studentsInBus},(err,data)=>{
                            if(err){
                                res.status(200).json({Error:"Student Not Added to Bus!"});
                            }
                            else{
                                console.log("Success!")
                                console.log(student);
                                res.status(200).json({Success:"Route And Buss Set Successfully!",data:student}); 
                            }
                        });
                    }else{
                        console.log("Route not set!")
                        res.status(404).json({Error:"Buss not Found!"});
            
                    }
                });
                    }else{
                        console.log("Route not set!")
                        res.status(404).json({Error:"Route not Set!"});
            
                    }
                });
                
            }
        })
    }
}
export default {
    indexFunction,
    loginFunction,
    getRouteFunction,
    changeRouteFunction,
    getDataFunction,
    getBus,
    getAttendence,
    setAttendence,
    setNearby,
    setStop,
    complainFunction,
    feedbackFunction,
    sendEmail,
    resetPass,
    changePass,
    getOneRouteFunction,
    selRoute
};
