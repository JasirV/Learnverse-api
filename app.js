const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');

//import Routes
const authRoutes =require("./routes/authRoutes");
const courseRouter=require('./routes/courseRoutes')
const chapterRouter=require('./routes/chapterRoutes')
const topicRouter=require('./routes/topicRoutes')
const discussionRoutes=require('./routes/discussionRoutes')

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.json());
app.use(morgan("dev"));

//routers  
app.use('/api/auth',authRoutes)
app.use('/api/courses',courseRouter)
app.use('/api/chapters',chapterRouter)
app.use('/api/topicRouter',topicRouter)
app.use('/api/discussions',discussionRoutes)


module.exports = app;