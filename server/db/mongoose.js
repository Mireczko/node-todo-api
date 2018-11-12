let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://<Mireczko>:<516500494a>@ds151892.mlab.com:51892/todoapp' || 'mongodb://locahost:27017/toDoApp', { useNewUrlParser: true });

module.exports = {
    mongoose
};