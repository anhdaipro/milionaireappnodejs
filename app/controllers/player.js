const User=require("../models/User")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Question = require("../models/Question")
const QuestionUser=require("../models/QuestionUser")
const AnswerUser=require("../models/AnswerUser")
const authcontroller=require('./auth')

const randomslice = (ar, size) => {
    let new_ar = [...ar];
    new_ar.splice(Math.floor(Math.random()*ar.length),1);
    return ar.length <= (size+1) ? new_ar : randomslice(new_ar, size);
}
const addquestions= async (req,res)=>{
    
        const questions=req.body.questions
        const list_questions=await Question.insertMany(questions)
        res.json({success:true})
    
}
const addquestion=async(req,res)=>{
    
        const user=await User.User.findOne({username:"phamdai"})
        const easy=await Question.find({level:'1'}).select('id')
        const normal=await Question.find({level:'1'}).select('id')
        const difficult=await Question.find({level:'1'}).select('id')
        const easy_list=randomslice(easy,5)
        const normal_list=randomslice(normal,5)
        const difficult_list=randomslice(difficult,5)
        const questions=[...easy_list,...normal_list,...difficult_list]
        const anwsers=await AnswerUser.create({user:user,questions:questions})
        const questionuser= await QuestionUser.create({user:user,question:easy_list[0]})
        const first_question=await Question.findById(easy_list[0],{id:"$_id",question:1,answer:1,choice:1})
        res.json({question:first_question,id:anwsers.id,questionuserid:questionuser.id})
    
}

const supportquestion=async(req,res)=>{
        let data={}
        const id=req.params.id
        const support_type=req.body.support_type
        const question_id=req.body.question_id
        const question=await Question.findById(question_id)
        const answeruser=await AnswerUser.findById(id)
        if (support_type=='1'){
            const choice=question.choice.filter(item=>item!=question.answer)
            const choice_hiden=randomslice(choice,2)
            data={...data,choice_hiden}
        }
        else{
            const user=await User.User.findOne({username:"phamdai"})
            const questions=await Question.find({ $and: [{level:question.level}, {id: { $ne: question_id }}]}).select('id')
            const id_change=randomslice(questions,1)
            const listquestions=answeruser.questions.map(item=>item._id.toString())
            const index=listquestions.indexOf(question_id)
            
            const question_change=await Question.findById(id_change,{id:"$_id",question:1,answer:1,choice:1})
            AnswerUser.findByIdAndUpdate(id, {$pop: { questions: index },$push: {
                questions: {
                   $each: id_change,
                   $position: index
                }
              }})
            const questionuser_change=await QuestionUser.create({user:user,question:id_change[0]})
            data={...data,question:question_change,questionuserid:questionuser_change.id}
        }
        res.json(data)
}

const answer=async(req,res)=>{
        let data={}
        const {answer,support,questionuserid,question_id}=req.body
        const id=req.params.id
        const question=await Question.findById(question_id)
        const questionuser=await QuestionUser.findById(questionuserid)
        const time_experi=new Date().getTime()-questionuser.createdAt.getTime()
        const time=time_experi/1000
        const data_questionuser_update=answer==question.answer?time<60?{correct:true}:{}:{}
        const questionuser_update=await QuestionUser.findByIdAndUpdate(questionuserid,data_questionuser_update)
        const data_answeruser_update=answer==question.answer?time<60?{$push: {answers:questionuser_update._id}}:{}:{}
        const answeruser=await AnswerUser.findByIdAndUpdate(id,data_answeruser_update)
        const data_user_update=answer==question.answer && time<60?{coins:{$inc:100}}:{}
        const user=await User.User.findOneAndUpdate({username:"phamdai"},data_user_update)
        if (answer==question.answer){
            if (time<60 || support){
                const listquestions=answeruser.questions.map(item=>item._id.toString())
                const index=listquestions.indexOf(question_id)
                if (index==listquestions.length-1){
                    data={...data,'success':true,'correct':true}
                }
                else{
                    const nextid=answeruser.questions[index+1]
                    const question_next=await Question.findById(nextid,{id:"$_id",question:1,answer:1,choice:1})
                    const questionuser_next=await QuestionUser.create({user:user,question:nextid})
                    data={...data,'questionNumber':index+1+1,'correct':true,'question':question_next,'questionuserid':questionuser_next.id}
                }
            }
            else{
                data={...data,'correct':false,'message':"expiried"}
            }
        }
        else{
            data={...data,'correct':false,'message':"notcorrect"}
        }
        res.json(data)
    
}
module.exports ={addquestion,addquestions,answer,supportquestion}

