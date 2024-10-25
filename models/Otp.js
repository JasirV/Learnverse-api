const mongoose =require( 'mongoose');

const otpSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the current date and time
    },
    expiresAt: {
        type: Date,
        default: function() {
            return Date.now() + 10 * 60 * 1000; // 10 minutes from now
        }
    }
});

// Create an index to automatically delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;