//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //destrukturyzacja


MongoClient.connect('mongodb://localhost:27017/toDoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err){
       return console.log('Unable to connect to database');
    }
        console.log('Connected to database');
        const db = client.db('toDoApp');
        // db.collection('toDo').find().count().then((count) => {
        //     console.log(`toDos count: ${count}`);
        // }, (err) => {
        //     console.log('Unable to fetch todos', err);
        // });


        db.collection('Users').find({name: "Jakub"}).toArray().then((documents) => {
            console.log(JSON.stringify(documents, undefined, 2));
        })

        client.close();
    });