import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const employees= new Schema({
 Name:String,
 Email:String,
 Address:String,
 Phone:String,

 
 Password:String,

//ConfirmPassword:String,


  
});
const Emp=mongoose.model('Reg',employees);

export {Emp};