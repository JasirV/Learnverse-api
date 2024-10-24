const mongoose= require('mongoose');


const connectDB= async function(){
    try {
        await mongoose.connect(process.env.DB_URL,{dbName:"highhydration"})
        console.log('DB connected successfully')
    } catch (error) {
        console.log('error connection in db',error)
    }
}
module.exports=connectDB;