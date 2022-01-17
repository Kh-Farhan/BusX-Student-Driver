import Student from '../models/studentModel.js';
import Route from '../models/routeModel.js';
import Driver from '../models/driverModel.js';
import Emergency from '../models/emergency.js';
import Fuel from '../models/fuelModel.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Bus from '../models/busModel.js';
import License from '../models/licenseModel.js';
import Complaint from "../models/complaintModel.js";
import Feedback from '../models/feedBackModel.js';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import Guest from '../models/guestModel.js';
const saltRounds = 10;


const indexFunction = (req, res, next)=>{
    console.log("here")
    res.json("INDEX")
};

const loginFunction =async (req, res, next)=>{
    console.log("here in Login Controller")
    const {cnic,password}=req.body;
    const existingDriver=await Driver.findOne({cnic});
    
   if(!existingDriver){
       res.status(404).json({message:"Invalid CNIC,User Not found!"});
   }
   if(password){
    const Hpassword=await bcrypt.compare(password,existingDriver.password);
    if(Hpassword){
     const token=jwt.sign({cnic:existingDriver.cnic,_id:existingDriver._id},"test",{expiresIn:"1h"});
     Bus.findOne({driver:existingDriver._id},(err,data)=>{
        if(err){
            res.status(404).json({message:"No Bus Assigned!!"});
        }
        else if(data){
            console.log("Login Success")
            License.findOne({institute:existingDriver.institute},(err,userInfo)=>{
                let years=parseInt(userInfo.type.charAt(0))
                let days=feeStatus(userInfo.paymentDate)-1
                let status=(days <= (365 * years));
                if(status){
                    res.status(200).json({result:existingDriver,Bus:data,token});
                }
                else{
                    res.status(200).json({error:"Not Allowed"});
                }
             }) 
        }
     });
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

const getRouteFunction=async (req, res, next)=>{
    console.log("Triggered");
    const driver=req.params.id;
    console.log(driver);
    Bus.findOne({driver:driver},(err,data)=>{
        if(!err){
            if(data){
                console.log(data);
                const route=data.route;
                Route.findOne({_id:route},(err,dat)=>{
                    if(!err){
                        if(dat){
                            console.log(dat);
                            res.status(200).json({result:dat});
                        }
                    }
                });
            }else{
                console.log("No Driver found!")
            }
           
        }
    })
};

const addGuestFunction=async (req, res, next)=>{
    console.log(req.body.institute);

    if(req.body){
    var guest = new Guest({name:req.body.name,regNo:req.body.regNo,contact:req.body.contact,destination:req.body.destination,institute:req.body.institute});

    guest.save(function(err, doc) {
      if (err) {
           console.error(err);
           res.status(404).json({message:"Error Adding Guest !!"});
        }
        if(doc){
            res.status(200).json({Success:"Guest Added !!"});
        }
      
    });
    }
};

const getDetailFunction=async (req, res, next)=>{
    let totalStudent=0;
    let studentOnBoard=0;
    let absentStudents=0;
    let feeDefaulters=0;
    let feeDefaultersName=[];
    let StopName=[];
    let Stops=[];
    let studentPstop=[];
    console.log("Triggered : "+req.params.bus);
    await Bus.findOne({_id:mongoose.Types.ObjectId(req.params.bus)},(err,data)=>{
        const r=data.toObject();
        if(data){
            Route.findOne({_id:mongoose.Types.ObjectId(data.route)},(err,dat)=>{
                const d=dat.toObject();
                console.log("Adresses is : "+d.addresses);
                if(dat){
                    Stops=d.stops;
                    StopName=d.addresses;
                    let arr=new Array(Stops.length).fill(0);
                    studentPstop=arr;
                }
            });
        }
    });
    await Student.find({bus: mongoose.Types.ObjectId(req.params.bus)},(err,data)=>{
        if(err){
            res.status(404).json({message:"Error getting Total Students !!"});
        }
        else if(data){
            totalStudent=data.length;
             Bus.findById(req.params.bus,(err,data)=>{
                if(data){
                    studentOnBoard=data.students.length;
                    absentStudents=totalStudent-studentOnBoard;
                      data.students.map( (el,index)=>{
                         Student.findOne({_id:mongoose.Types.ObjectId(el)},(err,dat)=>{
                            if(data){
                                console.log(data)
                                dat=dat.toObject();
                                if(dat.feeStatus!="payed"){
                                    feeDefaulters+=1;
                                    feeDefaultersName=[...feeDefaultersName,dat.firstName+" "+dat.lastName];
                                }
                                Stops.forEach((el,index)=>{
                                    if(dat.stop.latitude==el.lat){
                                        studentPstop[index]+=1;
                                    }
                                });
                                if(index===data.students.length-1){
                                    const obj={totalStudent:totalStudent,studentOnBoard:studentOnBoard,absentStudents:absentStudents,feeDefaulters:feeDefaulters,feeDefaultersName:feeDefaultersName,StopName:StopName,studentPstop:studentPstop};
                                    console.log(obj);
                                    res.status(200).json({detail:obj})
                                }
                            }
                        })
                    });
                    
                }
            });
            
        }
    });
    
            
};

const changePass=async (req,res)=>{
    console.log("id is:" +req.body.id);
    console.log(req.body.oldPass);
    const stud=await Driver.findById(req.body.id)
    console.log("pass in db: "+stud.password)
    if(stud){
        const Hpassword=await bcrypt.compare(req.body.oldPass,stud.password);
        if(Hpassword){
            if(req.body.password===req.body.repassword){
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    Driver.findOneAndUpdate({_id:req.body.id},{$set:{password:hash}},{useFindAndModify:false},(error,data)=>{
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
};

const reportEmergency=async (req, res, next)=>{
    console.log(req.body.bus);
    if(req.body){
        var emergency = new Emergency({issue:req.body.issue,description:req.body.description,currentLocation:req.body.loc,photo1:req.body.image1,photo2:req.body.image2,bus:req.body.bus});
    emergency.save(function(err, doc) {
      if (err) {
           console.error(err);
           res.status(404).json({message:"Error Reporting Emergency! \nFill All fields!"});
        }
        if(doc){
            res.status(200).json({Success:"Emergency Reported !!"});
        }
      
    });
    }

    
};
const addFuel=async (req, res, next)=>{
    console.log(req.body.Fuel);
    if(req.body.Fuel===undefined){
        res.status(404).json({message:"Please Entre the cost!"});
        return;
    }
    if(req.body){
        Fuel.findOne({bus:mongoose.Types.ObjectId(req.body.bus)},(err,data)=>{
            console.log(data);
            if(data){
                const obj={
                    cost:req.body.Fuel,
                    date:req.body.date
                }
                Fuel.updateOne(
                    { _id: mongoose.Types.ObjectId(data._id) }, 
                    { $push: { fuelHistory: obj } },
                    (err,data)=>{
                        if(data){
                            res.status(200).json({Success:"Fuel Added!!"});
                        }
                    }
                );
            }
            else{
                const obj=[{
                        cost:req.body.Fuel,
                        date:req.body.date}]
                console.log("object to be added:"+JSON.stringify(obj));
                var fuel=new Fuel({bus:mongoose.Types.ObjectId(req.body.bus),$push: { fuelHistory: obj }});
                fuel.save(function(err, doc) {
                    if (err) {
                         console.error(err);
                         res.status(404).json({message:"Error Adding Fuel!"});
                      }
                      if(doc){
                          res.status(200).json({Success:"New Fuel Added!"});
                      }
                    
                  });
            }
        });
    }
}
const getFuelHistory=(req, res, next)=>{
    console.log(req.params.bus);
    if(req.body){
        Fuel.findOne({bus:mongoose.Types.ObjectId(req.params.bus)},(err,data)=>{
            if(data){
                const history=data.fuelHistory;
                res.status(200).json({History:history});
            }
        })
    }
}
const scanRfid=(req, res, next)=>{
    console.log("here")
    console.log(req.body.rfid);
    if(req.body){
        Student.findOne({rfid:req.body.rfid},(err,data)=>{
            if(data){
                if(data.feeStatus==="Paid"){
                    res.status(200).json({Success:"Fee Paid!"});
                }
                else{
                    res.status(200).json({Success:"Fee Not Paid"});
                }
                
            }
            else{
                res.status(200).json({Success:"No Student Exist"});
            }
        })
    }
}
export default {
    indexFunction,
    loginFunction,
    getRouteFunction,
    addGuestFunction,
    getDetailFunction,
    changePass,
    reportEmergency,
    addFuel,
    getFuelHistory,
    scanRfid,
};
