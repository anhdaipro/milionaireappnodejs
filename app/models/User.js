const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  date_of_birth: { type: Date,default:Date() },
  email:{type:String,maxLength:100},
  password:{type:String,required: true},
  username:{type:String,required: true,unique:true},
  name:{type:String},
  phone:{type:String},
  avatar:{type:String},
  coins:{type:Number,default:0},
  is_active:{type:Boolean,default:false},
  is_staff:{type:Boolean,default:false},
  is_superuser:{type:Boolean,default:false}
},{timestamps:true});
const User=mongoose.model("User", UserSchema);
const VerifylinkSchema=new Schema({
    link:{type:String,maxLength:1000,trim:true},
    user_id:{type: String,required:true}
},{timestamps:true})
const VerifyemailSchema=new Schema({
    otp:{type:String,maxLength:10,trim:true,required:true},
    email:{type:String,maxLength:1000,trim:true,required:true}
},{timestamps:true})
const VerifyphoneSchema=new Schema({
  otp:{type:String,maxLength:10,trim:true,required:true},
  user_id:{type: String,required:true}
},{timestamps:true})
const Verifylink=mongoose.model("Verifylink", VerifylinkSchema);
const Verifyemail=mongoose.model("Verifyemail", VerifyemailSchema);
const Verifyphone=mongoose.model("Verifyphone", VerifyphoneSchema);
module.exports={User,Verifylink,Verifyemail,Verifyphone}