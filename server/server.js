let express = require('express');
let bodyParser = require('body-parser');

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

app.listen(3000, () => {
    console.log('Started on port 3000');
});
