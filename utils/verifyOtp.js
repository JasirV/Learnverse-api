const Otp = ('../models/Otp')


const otpVerify=async(email,otp)=>{
    const otpRecord = await Otp.findOne({email});
if (!otpRecord) {
         return {status:400,message: 'OTP not found for this email.'}
     }
    if (otpRecord.otp !== otp) {
         return {status:400,message: 'Invalid OTP.'};
     }
      
     await Otp.deleteOne({ email });
      
     return {status:200,message: 'OTP verified successfully.'};
}


export default otpVerify;