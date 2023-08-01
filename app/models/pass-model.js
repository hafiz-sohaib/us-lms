const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    password: {
        type: String,
    }
});

module.exports = mongoose.model('pass', passSchema);