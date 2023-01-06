const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AnswerUserSchema = new Schema({
    questions:{ type: Array,required:true},
    user: {type: Schema.Types.ObjectId, ref: 'User',required:true},
    answers:{type:Array},
    coins:{type:Number,default:0}
},{timestamps:true});
const AnswerUser=mongoose.model("AnswerUser", AnswerUserSchema);
module.exports=AnswerUser