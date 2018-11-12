let express = require('express');
let bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
let {mongoose} = require('./db/mongoose');
let {Task} = require('./models/Task');
let {User} = require('./models/User');

let app = express();

let jsonParser = bodyParser.json()
app.use(jsonParser);

app.post('/Tasks', (req, res) => {
    let newTask = new Task({
        text: req.body.text
    });
    newTask.save().then((document) => {
        res.send(document);
    }, (e) =>{
        res.status(400).send(e);
    });
});

app.get('/Tasks', (req, res) =>{
    Task.find().then((tasks) => {
        res.send({tasks});
    }, (e) => {
        res.status(404).send(e);
    });
});

app.get('/Tasks/:id', (req, res) => {
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

app.listen(3000, () => {
    console.log('Started on port 3000');
});
