const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/toDoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err){
       return console.log('Unable to connect to database');
    }
        console.log('Connected to database');
         const db = client.db('toDoApp');

    //     db.collection('toDo').insertOne({
    //         text: 'Something to do',
    //         completed: false
    //     }, (err, result) => {
    //         if(err){
    //             return console.log('Unable to instert task', err);
    //         }

    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     });
    // }
        db.collection('Users').insertOne({
            name: 'Jakub',
            age: 21,
            location: 'Kraków'
        }, (err, result) =>{
            if(err){
                return console.log('Unable to insert new user', err);
            }
            console.log(JSON.stringify(result.ops, undefined, 2));
        });

    client.close();
});