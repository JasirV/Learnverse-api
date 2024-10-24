const express =require('express')
const {createChapter, getChaptersForCourse, updateChapter, deleteChapter}=require('../controllers/chapterController')
const router=express.Router()

router.post('/:courseId',createChapter)
.get('/:courseId',getChaptersForCourse)
.put('/:id',updateChapter)
.delete(':/id',deleteChapter)

module.exports=router