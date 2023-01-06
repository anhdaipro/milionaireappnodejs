var express=require('express')
var router=express.Router()
const playercontroller=require('../controllers/player')
router.post('/addquestion',playercontroller.addquestion),
router.post('/add/question',playercontroller.addquestions),
router.post('/answer/:id',playercontroller.answer),
router.post('/support/:id',playercontroller.supportquestion)
module.exports=router