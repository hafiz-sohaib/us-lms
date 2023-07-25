const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail, isStrongPassword } = require('validator');


const authSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: [true, "Full Name is required"],
            minLength: [3, "Full Name should be at least 3 characters long"]
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            minLength: [3, "Username should be at least 3 characters long"],
            unique: [true, "Username is unique"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            validate: [isEmail, "Email should be a valid email address"],
            lowercase: [true, "Email should be lowercase"],
            unique: [true, "Email should be unique"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            validate: [isStrongPassword, "Password is too weak"],
        },
        role: {
            type: String,
            enum: ['¥student¥', '¥teacher¥', '¥admin¥'],
            default: '¥student¥'
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        access_token: {
            type: String,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true }
);


// ==================== Password Hashing ====================
authSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// ==================== Password Matching ====================
authSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('auth', authSchema);