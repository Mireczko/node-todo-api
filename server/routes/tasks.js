let express = require('express');
let router = express.Router();
let {authenticate} = require('./../middleware/authenticate');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

let {Task} = require('./../models/Task');

router.post('/', authenticate, (req, res) => {
    if(req.user.isAdmin===false) return res.status(401).send();
    let newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        user: req.body.user
    });
    newTask.save().then((document) => {
        res.send(document);
        req.user.removeOldToken(req.token);
    }), (e) =>{
        res.status(400).send(e);
    };
});

router.get('/', authenticate, (req, res) =>{
    if(req.user.isAdmin===true){
        Task.find({}).then((tasks) => {
            res.send({tasks});
            req.user.removeOldToken(req.token);
        }, (e) => {
            res.status(404).send(e);
        });
    } else {
        Task.find({
            user: req.user._id
        }).then((tasks) => {
            res.send({tasks});
            req.user.removeOldToken(req.token);
        }, (e) => {
            res.status(404).send(e);
        });
    }
});

router.get('/:id', authenticate, (req, res) => {
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
            req.user.removeOldToken(req.token);
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
            req.user.removeOldToken(req.token);
        }).catch((e) => {
            res.status(400).send();
        });
    }

});

router.delete('/:id', authenticate, (req, res) => {
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
            req.user.removeOldToken(req.token);
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        res.status(401).send();
    }
});


router.patch('/:id', authenticate, (req, res) => {
    let id= req.params.id;
    let date = new Date().getTime();
    let body = req.body;
    let details = body.details;

    Task.findOne({_id: id}).then((task) => {
        if(!task){
            return res.status(404).send();
        }
        if(task.title !== req.body.title || task.description !== req.body.description || task.user !== req.body.user ||res.body.details){
            if(task.title!=="" && task.description !==""){
                Task.findOne({_id: id}).then((task) => {
                    if(!task){
                        return res.status(404).send();
                    }
                    if(!_.isEqual(req.user._id,task.user)){
                        if(req.user.isAdmin===false) return res.status(404).send();
                    }
                    if(body.status){
                        task.status = body.status;
                        task.lastUpdatedAt = date;
                    }
                    if(body.title && req.user.isAdmin===true){
                        task.title = body.title;
                    }
                    if(body.description && req.user.isAdmin===true){
                        task.description = body.description;
                    }

                    if(body.details && body.details!==""){
                        task.appendHistory(details, date);
                    } 
                        res.send(task);
                        req.user.removeOldToken(req.token);
                    }
                );
            }
        }
    });
});

module.exports = router;