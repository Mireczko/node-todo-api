let mongoose = require('mongoose');

let Task = mongoose.model('Task', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    status:{
        type: String,
        default: 'Not started'
    },
    lastUpdatedAt: {
        type: Number,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
 });

 module.exports = {
     Task
 };