const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, //store ID of referenced doc
        ref: "User",
        required: true
    },
    task: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ToDo', ToDoSchema);
