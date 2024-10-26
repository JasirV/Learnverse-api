const express  =require('express')
const {createCourse,getCourses, updateCourse, deleteCourse, myCourse}=require('../controllers/courseController')
const authMiddleware = require('../middleware/authMiddleware')
const routes=express.Router()


routes.post('/',authMiddleware,createCourse)
.get('/',getCourses)
.get('/mycourse',authMiddleware,myCourse)
.put('/:id',authMiddleware,updateCourse)
.delete('/:id',authMiddleware,deleteCourse)

module.exports=routes