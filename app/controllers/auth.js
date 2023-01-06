const jwt = require('jsonwebtoken')
const User=require("../models/User")
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const email_user='daipham952@gmail.com'
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_user,
      pass: 'anhdai1234'
    }
});
  
const registeremail= async (req,res)=>{
    try{
        const {email,username}=req.body
        const query={ $or: [ { username:username}, { email: email } ] }
        const user=await User.User.findOne(query)
        if (user){
            res.json({error:'Tên tài khoản đã tồn tại.'})
        }
        else{
            usr_otp = Math.floor((Math.random() * 1000000) + 1);
            await User.Verifyemail.create({email:email, otp:usr_otp})
            var mailOptions = {
                from: email_user,
                to: email,
                subject: "Welcome to AnhDai's Shop - Verify Your Email!",
                text: `Chào mừng bạn đến với anhdai.com,\n Mã xác nhận email của bạn là: ${usr_otp}`
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            
        }
    }
    catch(err){
        res.json({error:err}) 
    }
}
const register= async (req,res,next)=>{
    const {username,password,name,phone,email,date_of_birth}=req.body
    const hashPassword = bcrypt.hashSync(password, 10);
    const user=await User.User.findOne({username:username})
    if(user){
        res.json({error:'Tên tài khoản đã tồn tại.'})
    }
    else{
        let newuser= new User.User({
            name:name,
            password:hashPassword,
            username:username,
            phone:phone,
            email:email,
            date_of_birth:date_of_birth
        })
        if(req.files){
            if(req.files.avatar){
                newuser.avatar=req.files.avatar[0].path
            }
        }
        await newuser.save()
        if(!newuser){
            res.json({
                error:"co loi"
            })
        }
        else{
            res.json({succes:true,id:newuser.id})
        }
    }
}
const sociallogin= async (req,res)=>{
    try{
        const {provider,social_id,name,username,email,password}=req.body
        const avatar=req.file
        let user=await User.User.findOne({social_id:social_id,auth_provider:provider})
        if(user){
            return
        }
        else{
            const hashPassword = bcrypt.hashSync(password, 10);
            user=new User({
                name:name,username:username,social_id:social_id,
                email:email,auth_provider:provider,password:hashPassword
            })
            if(file){
                user.avatar=avatar.path
            } 
            await user.save()  
        }
        const token=jwt.sign({id:user.id},'thesecrettoken', { expiresIn: '6h' })
        const refresh_token=jwt.sign({id:user.id},'refreshtokensecret', { expiresIn: '2d' })
        res.json({token,refresh_token,message:"Login succes"})
    }
    catch(err){
        res.json({error:err})
    }
}

const login= async (req,res,next)=>{
    const {username,password}=req.body
    console.log(username)
    const user=await User.User.findOne({ username:username});
    if(user){
        console.log(user.password)
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(passwordMatch){
            const access=jwt.sign({id:user.id},'thesecrettoken', { expiresIn: '6h' })
            const refresh=jwt.sign({id:user.id},'refreshtokensecret', { expiresIn: '2d' })
            res.json({access,refresh,message:"Login succes"})
        }
        else{
            res.json({message:'password not correct'})
        }
    }
    else{
        res.json({message:"user not found"})
    }
}
const authenticate=(req)=>{
    try{
        const token=req.headers.authorization.split(" ")[1]
        const decode=jwt.verify(token,"thesecrettoken")
        req.user=decode
        return req.user.id
    }
    catch(err){
        if(err.name=="TokenExpiredError"){
            return null
        }
        else{
            return null
        }
        
    }
}
const updateprofile= async (req,res)=>{
    try{
        const {name}=req.body
        const file=req.file
        const data=file?{avatar:file.avatar.path,name:name}:{name:name}
        const user= await User.User.findOneAndUpdate({id:req.params.id},data,{new: true})
        res.send(user);
    }
    catch(err){
        res.status(400).json({
            err
        })
    }
}
const get_profile= async () =>{
    const user=await User.User.aggregate([
        { $match : { id:ObjectId(authenticate(req)) }} ,
        {
            $project: {
                name: 1,
                avatar:1,
                id:"$_id",
            },
        },
        {
            $set:{
                count_playlist:await Playlist.Playlist.find({user:req.user.id}).count()
            }
        }
    ])
    res.json(user[0])
}
const refreshtoken=(req,res)=>{
    const refresh=req.body.refresh
    jwt.verify(refresh,"refreshtokensecret",function(err,decode){
        if(err){
            res.status(400).json({
                err
            })
        }
        else{
            const access=jwt.sign({id:decode.id},'thesecrettoken', { expiresIn: '6h' })
            res.json({
                access,
                refresh,
                message:"sucess refresh"
            })
        }
    })
}
const userinfo = async (req,res)=>{
    authenticate(req,res)
    console.log(authenticate(req,res))
    const user=await User.User.aggregate([
        { $match : { _id:ObjectId(authenticate(req,res)) }} ,
        {
            $project: {
                name: 1,
                username:1,
                avatar:1,
                id:"$_id",
            },
        }
    ])
   
    res.json(user[0])
}
module.exports={
    register,updateprofile,login,authenticate,refreshtoken,userinfo,sociallogin,registeremail,get_profile
}