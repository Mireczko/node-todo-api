let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose');
let {Task} = require('./models/Task');
let {User} = require('./models/User');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
let cookieParser = require('cookie-parser');
let {authenticate} = require('./middleware/authenticate');

let app = express();

let jsonParser = bodyParser.json()
app.use(jsonParser);
app.use(cookieParser());

let tasks = require('./routes/tasks');
let users = require('./routes/users');


// app.get('/users/me', authenticate, (req, res) => {
//     res.send(req.user);
//     req.user.removeOldToken(req.token);
// });

// app.post('/users', authenticate, (req, res) => {
//     if(req.user.isAdmin===false) return res.status(401).send();
//     let body = _.pick(req.body, ['username', 'password', 'isAdmin']);
//     let newUser = new User(body);

//     newUser.save().then(() => {
//         res.status(200).send();
//         req.user.removeOldToken(req.token);
//     }).catch((e) => {   
//         res.status(400).send(e);
//     });
// });

// app.post('/users/login', (req, res) => {
//     let body = _.pick(req.body, ['username', 'password']);
//     User.findByCredentials(body.username, body.password).then((user) => {
//         return user.generateAuthToken().then((token) => {
//             res.header('x-auth', token).send(user);
//             user.removeOldToken(token);
//             //res.cookie('x-auth', token, { maxAge: 900000, httpOnly: true }).send(user);
//         });
//     }).catch((e) => {
//         res.status(400).send();
//     });
// });

// app.delete('/users/me/token', authenticate, (req, res) => {
//     req.user.removeToken(req.token).then(() =>{
//         res.status(200).send();
//         req.user.removeOldToken(req.token);
//     }), () => {
//         res.status(400).send();
//     }
// });

// app.post('/tasks', authenticate, (req, res) => {
//     if(req.user.isAdmin===false) return res.status(401).send();
//     let newTask = new Task({
//         title: req.body.title,
//         description: req.body.description,
//         user: req.body.user
//     });
//     newTask.save().then((document) => {
//         res.send(document);
//         req.user.removeOldToken(req.token);
//     }), (e) =>{
//         res.status(400).send(e);
//     };
// });

// app.get('/tasks', authenticate, (req, res) =>{
//     if(req.user.isAdmin===true){
//         Task.find({}).then((tasks) => {
//             res.send({tasks});
//             req.user.removeOldToken(req.token);
//         }, (e) => {
//             res.status(404).send(e);
//         });
//     } else {
//         Task.find({
//             user: req.user._id
//         }).then((tasks) => {
//             res.send({tasks});
//             req.user.removeOldToken(req.token);
//         }, (e) => {
//             res.status(404).send(e);
//         });
//     }
// });

// app.get('/tasks/:id', authenticate, (req, res) => {
//     let id = req.params.id;
//     if(!ObjectID.isValid(id)){
//        return res.status(400).send();
//     }
//     if(req.user.isAdmin===true){
//         Task.findOne({
//             _id: id,
//         }).then((task) => {
//             if(!task){
//                 return res.status(404).send();
//             }
//             res.send({task});
//             req.user.removeOldToken(req.token);
//         }).catch((e) => {
//             res.status(400).send();
//         });
//     } else {
//         Task.findOne({
//             _id: id,
//             user: req.user._id
//         }).then((task) => {
//             if(!task){
//                 return res.status(404).send();
//             }
//             res.send({task});
//             req.user.removeOldToken(req.token);
//         }).catch((e) => {
//             res.status(400).send();
//         });
//     }

// });

// app.delete('/tasks/:id', authenticate, (req, res) => {
//     let id = req.params.id;
//     if(!ObjectID.isValid(id)){
//         return res.status(404).send();
//     }
//     if(req.user.isAdmin===true){
//         Task.deleteOne({
//             _id: id,
//         }).then((task) =>{
//             if(!task){
//                 return res.status(404).send();
//             }
//             res.send(task);
//             req.user.removeOldToken(req.token);
//         }).catch((e) => {
//             res.status(400).send();
//         });
//     } else {
//         res.status(401).send();
//     }
// });


// app.patch('/tasks/:id', authenticate, (req, res) => {
//     let id= req.params.id;
//     let date = new Date().getTime();
//     let body = req.body;
//     let details = body.details;

//     Task.findOne({_id: id}).then((task) => {
//         if(!task){
//             return res.status(404).send();
//         }
//         if(task.title !== req.body.title || task.description !== req.body.description || task.user !== req.body.user ||res.body.details){
//             if(task.title!=="" && task.description !==""){
//                 Task.findOne({_id: id}).then((task) => {
//                     if(!task){
//                         return res.status(404).send();
//                     }
//                     if(!_.isEqual(req.user._id,task.user)){
//                         if(req.user.isAdmin===false) return res.status(404).send();
//                     }
//                     if(body.status){
//                         task.status = body.status;
//                         task.lastUpdatedAt = date;
//                     }
//                     if(body.title && req.user.isAdmin===true){
//                         task.title = body.title;
//                     }
//                     if(body.description && req.user.isAdmin===true){
//                         task.description = body.description;
//                     }

//                     if(body.details && body.details!==""){
//                         task.appendHistory(details, date);
//                     } 
//                         res.send(task);
//                         req.user.removeOldToken(req.token);
//                     }
//                 );
//             }
//         }
//     });
// });

app.use('/users', users);
app.use('/tasks', tasks);

app.listen(3000, () => {
    console.log(`Started on port ${3000}`);
});

module.exports= {
    app
};
