let mongoose = require('mongoose');

let TaskSchema =  new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    history: [{
        details:{
            type: String,
            required: true,
            minlength: 1
        },
        date:{
            type: Number,
        }
    }],
    status:{
        type: String,
        default: 'Not started'
    },
    lastUpdatedAt: {
        type: Number,
        default: null,
        expires: 15
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
 });


TaskSchema.methods.appendHistory = function (details, date) {
    let task = this;

    task.history = task.history.concat([{details, date}]);
    return task.save();
};
 
let Task = mongoose.model('Task', TaskSchema);

 module.exports = {
     Task
 };
