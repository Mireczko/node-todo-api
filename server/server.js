let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose');
let {Task} = require('./models/Task');
let {User} = require('./models/User');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
let {authenticate} = require('./middleware/authenticate');

let app = express();

let jsonParser = bodyParser.json()
app.use(jsonParser);


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', authenticate, (req, res) => {
    if(req.user.isAdmin===false) return res.status(401).send();
    let body = _.pick(req.body, ['username', 'password', 'isAdmin']);
    let newUser = new User(body);

    newUser.save().then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['username', 'password']);
    User.findByCredentials(body.username, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user); 
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    }), () => {
        res.status(400).send();
    }
});

app.post('/tasks', authenticate, (req, res) => {
    if(req.user.isAdmin===false) return res.status(401).send();
    let newTask = new Task({
        text: req.body.text,
        user: req.body.user
    });
    newTask.save().then((document) => {
        res.send(document);
    }), (e) =>{
        res.status(400).send(e);
    };
});

app.get('/tasks', authenticate, (req, res) =>{
    if(req.user.isAdmin===true){
        Task.find({}).then((tasks) => {
            res.send({tasks});
        }, (e) => {
            res.status(404).send(e);
        });
    } else {
        Task.find({
            user: req.user._id
        }).then((tasks) => {
            res.send({tasks});
        }, (e) => {
            res.status(404).send(e);
        });
    }
});

app.get('/tasks/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(400).send();
    }
    if(req.user.isAdmin===true){
        Task.findOne({
            _id: id,
        }).then((task) => {
            if(!task){
                return res.status(404).send();
            }
            res.send({task});
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        Task.findOne({
            _id: id,
            user: req.user._id
        }).then((task) => {
            if(!task){
                return res.status(404).send();
            }
            res.send({task});
        }).catch((e) => {
            res.status(400).send();
        });
    }

});

app.delete('/tasks/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(req.user.isAdmin===true){
        Task.deleteOne({
            _id: id,
        }).then((task) =>{
            if(!task){
                return res.status(404).send();
            }
            res.send(task);
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        res.status(401).send();
    }
});

app.patch('/tasks/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'status']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(req.body.hasOwnProperty('status')){
        body.status = req.body.status.toLowerCase();
        if(body.status !== 'in progress' && body.status !== 'completed' && body.status !=='not started'){
            return res.status(400).send();
        }
    }
    body.lastUpdatedAt = new Date().getTime();

    if(req.user.isAdmin===true){
        Task.findOneAndUpdate({
            _id: id,
        }, {$set: body}, {new: true}).then((task) => {
            if(!task){
                return res.status(404).send();
            }
            res.send({task});
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        Task.findOneAndUpdate({
            _id: id,
            user: req.user._id
        }, {$set: body}, {new: true}).then((task) => {
            if(!task){
                return res.status(404).send();
            }
            res.send({task});
        }).catch((e) => {
            res.status(400).send();
        });
    }
});

app.listen(3000, () => {
    console.log(`Started on port ${3000}`);
});
