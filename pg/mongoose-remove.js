const {ObjectID} = require('mongodb');
const {mongoose} = require('D:/Projekty/JavaScript/Node/toDo/server/db/mongoose');
const {Task} = require ('D:/Projekty/JavaScript/Node/toDo/server/models/Task');
const {User} = require ('D:/Projekty/JavaScript/Node/toDo/server/models/User');

// Task.deleteMany({}).then((result) => {
//     console.log(result);
// });

// Task.findByIdAndDelete('5c1e40076dbe2f20dca85122').then((task) =>{
//     console.log(task);
// });

Task.deleteOne({_id: ''}).then((task) => {
    console.log(task);
});