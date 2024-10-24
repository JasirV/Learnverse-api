const express  =require('express')
const {createCourse,getCourses, updateCourse, deleteCourse}=require('../controllers/courseController')
const authMiddleware = require('../middleware/authMiddleware')
const routes=express.Router()


routes.post('/',authMiddleware,createCourse)
.get('/',getCourses)
.put('/:id',updateCourse)
.delete('/:id',deleteCourse)

module.exports=routes