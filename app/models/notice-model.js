const mongoose = require('mongoose');


const noticeSchema = new mongoose.Schema(
    {
        notice_title: {
            type: String,
            required: [true, "Notice Title is required"],
            minLength: [3, "Notice Title should be at least 3 characters long"]
        },
        notice_roll: {
            type: String,
            enum: ['for-students', 'for-teachers', 'for-everyone'],
            default: 'for-students'
        },
        notice_periority: {
            type: String,
            enum: ['high', 'normal', 'low'],
            default: 'high'
        },
        notice_content: {
            type: String,
            required: [true, "Notice Content is required"],
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('notices', noticeSchema);