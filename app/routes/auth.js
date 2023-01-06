var express=require('express')
var router=express.Router()
const upload=require("../middleware/upload")
const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'image', maxCount: 1 }])
const authcontroller=require('../controllers/auth')
router.post('/register',cpUpload,authcontroller.register),
router.post('/login',authcontroller.login),
router.post('/refresh',authcontroller.refreshtoken),
router.post('/authenticate',authcontroller.authenticate),
router.get('/user/info',authcontroller.userinfo),
router.get('/oauth/login',upload.single('avatar'),authcontroller.sociallogin),
router.post('/user/:id',upload.single('avatar'),authcontroller.updateprofile)
router.get('/profile',authcontroller.get_profile)
module.exports=router