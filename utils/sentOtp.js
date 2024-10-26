const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Otp = require('../models/Otp');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "mycluster775@gmail.com", // Change to your email
        pass: "wqsv uxgd ztff shpz", // Change to your password
    },
    tls: {
        rejectUnauthorized: true
    }
});

const sendOtp = async (user) => {
    const { _id, email } = user;
    console.log('User for OTP:', user);
    const otp = crypto.randomInt(100000, 1000000).toString();

    try {
        const existOtp = await Otp.findOne({ email });

        if (!existOtp) {
            const optvar=await Otp.create({
                userId: _id,
                email: email,
                otp: otp,
                createdAt: Date.now(),
                expiresAt: Date.now() + 10 * 60 * 1000,
            });
            optvar.save()
        } else {
            await Otp.updateOne({ email }, { $set: { otp: otp } });
        }

        const info = await transporter.sendMail({
            from: '"Learnverse👻" <mycluster775@gmail.com>', // Change to your email
            to: email,
            subject: "Verify Email for Cluster",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Email for Cluster</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4a4a4a;">Cluster Community</h2>
                    <p>Hello, User</p>
                    <p>Please use the following OTP to verify your email address:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</p>
                    <p>If you didn't request this, you can ignore this email.</p>
                </div>
            </body>
            </html>`
        });

        return {
            status: 201,
            message: 'Verification email has been sent. Check your email for further instructions.',
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error("Something went wrong while sending the OTP");
    }
};

module.exports = sendOtp;
