const {ObjectID} = require('mongodb');

const {mongoose} = require('D:/Projekty/JavaScript/Node/toDo/server/db/mongoose');
const {Task} = require ('D:/Projekty/JavaScript/Node/toDo/server/models/Task');
const {User} = require ('D:/Projekty/JavaScript/Node/toDo/server/models/User');
let id = "5be9abe8660501275c7c9e2611";

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

// Task.find({
//     _id: id
// }).then((tasks) => {
//     console.log(JSON.stringify('Tasks',undefined, 2), tasks);
// });

// Task.findOne({
//     _id: id
// }).then((task) => {
//     console.log(JSON.stringify('Task', undefined, 2), task);
// });

// Task.findById(id).then((task) => {
//     if(!task){
//         return console.log('ID not found');
//     }
//     console.log('Task by id: ', task);
// }).catch((e) => console.log(e));

User.findById('5be9e2d1eaa01700c5176fd7').then((user) => {
    if(!user){
        return console.log('Unable to find user');
    }
        console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e);
});