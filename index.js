import express from 'express';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.js'
import rolesRouter from "./src/routes/roles.js"
import permissionRouter from "./src/routes/permission.js"
import mongoose from 'mongoose';
dotenv.config()
const app = express();

app.use(express.json());

app.use('/auth' , authRouter)
app.use('/roles' , rolesRouter)
app.use('/permission' , permissionRouter)
app.get('',(req,res)=>{
    res.send('Hello from the server!')
});
mongoose.connect(process.env.MONGODB)
app.listen(process.env.PORT,(req,res)=>{
    console.log(`Server is running on port ${process.env.PORT}`)  // Replace with your port number
});