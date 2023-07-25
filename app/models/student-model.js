const mongoose = require('mongoose');
const { isEmail } = require('validator');


const studentSchema = new mongoose.Schema(
    {
        student_roll_number: {
            type: String,
            required: [true, "Student Roll Number is required"],
            unique: [true, "Roll Number should be unique"]
        },
        student_name: {
            type: String,
            required: [true, "Student Name is required"],
            minLength: [3, "Student Name should be at least 3 characters long"]
        },
        student_email: {
            type: String,
            required: [true, "Student Email is required"],
            validate: [isEmail, "Student Email should be a valid email address"],
            lowercase: [true, "Email should be lowercase"],
            unique: [true, "Email should be unique"]
        },
        student_phone: {
            type: String,
            required: [true, "Student Phone Number is required"],
            unique: [true, "Phone Number is unique"]
        },
        student_cnic: {
            type: String,
            required: [true, "Student CNIC is required"],
            unique: [true, "CNIC is unique"]
        },
        student_year: {
            type: String
        },
        student_address: {
            type: String,
            required: [true, "Student Address is required"]
        },
        student_profile: {
            type: String
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('students', studentSchema);