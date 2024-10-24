const express =require('express')
const {createDiscussion, getDiscussion, commentDiscussion, replyComment}=require('../controllers/discussionController')
const router=express.Router()

router.post('/',createDiscussion)
.get('/:courseId',getDiscussion)
.post('/:discussionId/comments',commentDiscussion)
.post('/:discussionId/comments/:commentId/replies',replyComment)

module.exports=router