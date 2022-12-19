const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sendAt: {
        type: String,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);