const express =require('express')
const {register,login,logout,logoutAll, gitHubAuth, googleAuth, verifyUserOtp}=require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',authMiddleware,logout)
router.post('/logoutall',authMiddleware,logoutAll)
router.get('/github/callback', gitHubAuth);
router.post('/google',googleAuth)
.post('/verify',verifyUserOtp)
module.exports= router