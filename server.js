const dotenv=require('dotenv')
dotenv.config({path:'./.env'})
const app = require('./app')
const connectDB = require('./config/db')
 
const port=process.env.PORT
connectDB();  

app.listen(port,()=>{ 
    console.log(`server running port no :${port}`)
})    