import { Double } from 'mongodb';
import mongoose from 'mongoose';
const { Schema } = mongoose;

const Custom = new Schema({
Firstname:String,
Middlename:String,
Lastname:String,
Phone:String,
Orders:[{id:String}],
Email:String,
Password:String,
chat:[{msg:String, issent:Boolean}],
  
});
 const customers =mongoose.model('customers',Custom);

export {customers};
