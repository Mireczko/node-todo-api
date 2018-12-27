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

app.use('/users', users);
app.use('/tasks', tasks);

app.listen(3000, () => {
    console.log(`Started on port ${3000}`);
});

module.exports= {
    app
};
