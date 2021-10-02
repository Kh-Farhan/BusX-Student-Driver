import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import express from 'express'
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import studentRouter from "./routes/student.routes.js";
import driverRouter from "./routes/driver.routes.js";
import bodyParser from 'body-parser';
const app =express()
dotenv.config();
connectDB();
//notFound();
//errorHandler();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use('/student',studentRouter);
app.use('/driver',driverRouter);

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} port ${PORT}`));
