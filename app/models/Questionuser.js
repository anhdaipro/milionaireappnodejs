const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuestionUserSchema = new Schema({
    question:{ type: Schema.Types.ObjectId, ref: 'Question',required:true},
    user: {type: Schema.Types.ObjectId, ref: 'User',required:true},
    correct:{type:Boolean,default:false}
},{timestamps:true});
const QuestionUser=mongoose.model("QuestionUser", QuestionUserSchema);

module.exports=QuestionUser