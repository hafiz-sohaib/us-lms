const mongoose = require('mongoose');
const { isEmail } = require('validator');


const teacherSchema = new mongoose.Schema(
    {
        teacher_roll_number: {
            type: String,
            required: [true, "Teacher Roll Number is required"],
            unique: [true, "Roll Number should be unique"]
        },
        teacher_name: {
            type: String,
            required: [true, "Teacher Name is required"],
            minLength: [3, "Teacher Name should be at least 3 characters long"]
        },
        teacher_email: {
            type: String,
            required: [true, "Teacher Email is required"],
            validate: [isEmail, "Teacher Email should be a valid email address"],
            lowercase: [true, "Email should be lowercase"],
            unique: [true, "Email should be unique"]
        },
        teacher_phone: {
            type: String,
            required: [true, "Teacher Phone Number is required"],
            unique: [true, "Phone Number is unique"]
        },
        teacher_cnic: {
            type: String,
            required: [true, "Teacher CNIC is required"],
            unique: [true, "CNIC is unique"]
        },
        teacher_year: {
            type: String
        },
        teacher_address: {
            type: String,
            required: [true, "Teacher Address is required"]
        },
        teacher_profile: {
            type: String
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('teachers', teacherSchema);