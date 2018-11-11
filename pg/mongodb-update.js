//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //destrukturyzacja

MongoClient.connect('mongodb://localhost:27017/toDoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err){
       return console.log('Unable to connect to database');
    }
        console.log('Connected to database');
        const db = client.db('toDoApp');

        // db.collection('toDo').findOneAndUpdate({
        //     _id: new ObjectID('5be87fba70c787dce70af9ba')
        // }, {
        //     $set: {
        //         completed: true
        //     }
        // }, {
        //     returnOriginal: false
        // }).then((result) => {
        //     console.log(result);
        // });

        db.collection('Users').findOneAndUpdate({
            _id: new ObjectID("5be87b8d70c787dce70af89c")
        }, {
           $set: {
               name: "Jakub"
           },
           $inc: {
                age: 2
           }
        }, {
            returnOriginal: false
        }).then((result) =>{
            console.log(result);
        });
 
    client.close();
});