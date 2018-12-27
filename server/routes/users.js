let express = require('express');
let router = express.Router();
let {authenticate} = require('./../middleware/authenticate');
const _ = require('lodash');


let {User} = require('./../models/User');

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
    req.user.removeOldToken(req.token);
});

router.post('/', authenticate, (req, res) => {
    if(req.user.isAdmin===false) return res.status(401).send();
    let body = _.pick(req.body, ['username', 'password', 'isAdmin']);
    let newUser = new User(body);

    newUser.save().then(() => {
        res.status(200).send();
        req.user.removeOldToken(req.token);
    }).catch((e) => {   
        res.status(400).send(e);
    });
});

router.post('/login', (req, res) => {
    let body = _.pick(req.body, ['username', 'password']);
    User.findByCredentials(body.username, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
            user.removeOldToken(token);
            //res.cookie('x-auth', token, { maxAge: 900000, httpOnly: true }).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

router.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
        req.user.removeOldToken(req.token);
    }), () => {
        res.status(400).send();
    }
});

router.delete('/clearTrash', authenticate, (req, res) => {
    if(req.user.isAdmin===false) return res.status(401).send();
    User.removeTrashTokens(600000).then((doc) => {
        console.log(doc);
        res.status(200).send()
    }), () => {
        res.status(400).send();
    }
});

module.exports = router;