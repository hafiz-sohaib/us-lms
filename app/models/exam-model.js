const mongoose = require('mongoose');


const examSchema = new mongoose.Schema(
    {
        exam_teacher: {
            type: String,
            required: [true, "Exam Teacher is required"],
            unique: [true, "Exam Teacher is unique"]
        },
        exam_shift: {
            type: String,
            required: [true, "Exam Shift is required"],
            unique: [true, "Exam Shift is unique"]
        },
        exam_room: {
            type: String,
            required: [true, "Exam Room is required"],
            unique: [true, "Exam Room is unique"]
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('exam-duties', examSchema);