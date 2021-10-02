import Student from '../models/studentModel.js';
import Route from '../models/routeModel.js';
import Driver from '../models/driverModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Bus from '../models/busModel.js';
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
            res.status(200).json({result:existingDriver,Bus:data,token});
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
    console.log(req.body.id)
    if(req.body){
    var guest = new Guest({name:req.body.name,regNo:req.body.regNo,contact:req.body.contact,destination:req.body.destination});

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
    console.log("Triggered : "+req.params.bus);
    Student.find({bus: mongoose.Types.ObjectId(req.params.bus)},(err,data)=>{
        if(err){
            res.status(404).json({message:"Error getting Total Students !!"});
        }
        else if(data){
            totalStudent=data.length;
            Bus.findById(req.params.bus,(err,data)=>{
                if(data){
                    studentOnBoard=data.students.length;
                    absentStudents=totalStudent-studentOnBoard;
                    console.log(studentOnBoard);

                }
            })
        }
    })
};

export default {
    indexFunction,
    loginFunction,
    getRouteFunction,
    addGuestFunction,
    getDetailFunction
};
