import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import express from 'express';
import mongoose from 'mongoose';
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import studentRouter from "./routes/student.routes.js";
import driverRouter from "./routes/driver.routes.js";
import bodyParser from 'body-parser';
import { Server } from "socket.io";
import Bus from './models/busModel.js';
import http from "http";
import geodist from 'geodist';
import { captureRejectionSymbol } from 'events';
import Student from './models/studentModel.js';
import fetch from 'node-fetch';
const app =express();
const server = http.createServer(app);
const io = new Server(server);
dotenv.config();
connectDB();
//notFound();
//errorHandler();
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({limit: '10mb', extended: true}));
app.use('/student',studentRouter);
app.use('/driver',driverRouter);


//Socket
io.on("connection", socket => {
    let changeStream=0;
    let notificationSent=[];
    console.log("a user connected :D");
    console.log(socket.id);
    socket.on("initial_data",data=>{
        if(data.status==="end"){  
                 console.log("heree ENding!"+data.bus);
            Bus.findOneAndUpdate({_id:data.bus},{$set:{currentLocation:null}},{useFindAndModify:false},(error,data)=>{
                if(error){
                   console.log({message:"Error Updating Location!!"});
                }
                if(data){
                    console.log("Sending Null !!!!!")
                    notificationSent=[];
                    console.log({Success:"Location Nullified!!"});
                    
                }
            });
            console.log("Sharing Stopped!!");
        }else{
            const obj={lat:data.lat,lng:data.lng}
            const BusLoc={lat:data.lat,lon:data.lng};   
            Bus.findOneAndUpdate({_id:data.bus},{$set:{currentLocation:obj}},{new: true,useFindAndModify:false}).populate('students').exec((error,data)=>{
                if(error){
                    console.log(error);
                   console.log({message:"Error Updating Location!!"});
                }

                if(data){
                    console.log("Changing Coors: "+JSON.stringify(obj));
                    data.students.forEach(async (el,ind)=>{
                        let stdLoc={lat:el.nearbyAlert.latitude,lon:el.nearbyAlert.longitude}; 
                        const dist=geodist(BusLoc,stdLoc,{unit: 'meters',limit:40});
                        if(dist){
                            if(!notificationSent.includes(el._id.toString())){
                                notificationSent=[...notificationSent,el._id.toString()];
                                console.log("Sending Notification to "+el._id);
                                const response = await fetch('https://exp.host/--/api/v2/push/send', {
                                method: 'post',
                                body: JSON.stringify({
                                    to:  `${el.notificationToken}`,
                                    title:"BUSX",
                                    body: "Your bus is about to reach, be ready!"
                                  }),
                                headers: {
                                    "host": "exp.host",
                                    "accept": "application/json",
                                    "accept-encoding": "gzip, deflate",
                                    "content-type": "application/json"
                                }
                            });
                            const data = await response.json();
                            console.log(data);
                            }
                        }
                        console.log(ind+": "+dist);
                    });
                    console.log({Success:"Location Updated!!"});
                }
            });
        }
        
    });

    socket.on("get_loc",(data)=>{
        console.log(data.bus);
        Bus.findOne({_id:data.bus},(error,data)=>{
            if(data){
                console.log("Emitting First Location");
                if(data===null){
                    changeStream.close();
                }
                socket.emit("Loc",data.currentLocation);
            }
        });
        changeStream=Bus.watch();
        changeStream.on('change',change=>{
            console.log(change.documentKey._id);
            if(change.documentKey._id==data.bus){
                console.log("Bus Matched!")
                if("currentLocation"in change.updateDescription.updatedFields){
                    if(change.updateDescription.updatedFields.currentLocation===null){
                        console.log("Location Now Stopped!!");
                        socket.emit("Loc",change.updateDescription.updatedFields.currentLocation);
                        changeStream.close();
                    }
                    else{
                        console.log("Location Changed!!");
                        console.log(change.updateDescription.updatedFields.currentLocation);
                        socket.emit("Loc",change.updateDescription.updatedFields.currentLocation);
                    }
                }
            }
            
        });
        
    });
    socket.on("close",()=>{
       changeStream.close();
    })
    socket.on("AddNotificationToken",(data)=>{
        console.log(data.Ntoken);
        Student.findOneAndUpdate({_id:data.Sid},{$set:{notificationToken:data.Ntoken}},{returnNewDocument: true,useFindAndModify:false},(error,data)=>{
            if(data){
                console.log("Token Added");
            }else{
                console.log("Error");
    
            }
        });
        
    });
    socket.on("getBus",(data)=>{
        Student.findById(mongoose.Types.ObjectId(data),(err,data)=>{
            if(data){
                console.log("Bus We Get is:"+data.bus);
                console.log(data.bus)
                socket.emit("busId",data.bus);
            }if(err){
                console.log(err)
            }
        }).lean();
    })
});

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} port ${PORT}`));
server.listen(4000,console.log('Socket Running!!'))