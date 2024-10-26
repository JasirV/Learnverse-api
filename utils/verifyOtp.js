const Otp =require('../models/Otp')


const otpVerify=async(email,otp)=>{
    const otpRecord = await Otp.findOne({email});
    console.log(otpRecord,'rec')
if (!otpRecord) {
         return {status:400,message: 'OTP not found for this email.'}
     }
     console.log(otpRecord.otp,otp,'otps')
    if (otpRecord.otp !== otp) {
         return {status:400,message: 'Invalid OTP.'};
     }
      
     await Otp.deleteOne({ email });
      
     return {status:200,message: 'OTP verified successfully.'};
}


module.exports = otpVerify;