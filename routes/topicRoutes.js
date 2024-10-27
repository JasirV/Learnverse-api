const express =require('express')
const {createTopic, getTopics, updateTopic, deleteTopic} =require('../controllers/topicContoller')
const router=express.Router()

router.post('/:chapterId',createTopic)
.get('/:chapterId',getTopics)
.put('/:id',updateTopic)
.delete('/:id',deleteTopic)
module.exports=router