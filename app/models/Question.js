const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  question: { type:String,required: true,unique:true},
  choice:{type:Array,required: true},
  answer:{type:String,required: true},
  level:{type:String,required: true},
},{timestamps:true});
const Question=mongoose.model("Question", QuestionSchema);
module.exports=Question