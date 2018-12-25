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

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['username', 'password']);
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
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

app.post('/tasks', (req, res) => {
    let newTask = new Task({
        text: req.body.text
    });
    newTask.save().then((document) => {
        res.send(document);
    }), (e) =>{
        res.status(400).send(e);
    };
});

app.get('/tasks', (req, res) =>{
    Task.find().then((tasks) => {
        res.send({tasks});
    }, (e) => {
        res.status(404).send(e);
    });
});

app.get('/tasks/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(400).send();
    }
    Task.findById(id).then((task) => {
        if(!task){
            return res.status(404).send();
        }
        res.send({task});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/tasks/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Task.findByIdAndDelete(id).then((task) =>{
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/tasks/:id', (req, res) => {
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

    Task.findByIdAndUpdate(id, {$set: body}, {new: true}).then((task) => {
        if(!task){
            return res.status(404).send();
        }
        res.send({task});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.listen(3000, () => {
    console.log(`Started on port ${3000}`);
});
