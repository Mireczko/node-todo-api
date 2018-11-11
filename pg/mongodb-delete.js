const {MongoClient, ObjectID} = require('mongodb'); //destrukturyzacja


MongoClient.connect('mongodb://localhost:27017/toDoApp',{ useNewUrlParser: true }, (err, client) => {
    if(err){
       return console.log('Unable to connect to database');
    }
        console.log('Connected to database');
        const db = client.db('toDoApp');

        

        //DELETE MANY

        // db.collection('toDo').deleteMany({text: 'Do homework'}).then((result) => {
        //     console.log(result);
        // });


        //DELETE ONE

        // db.collection('toDo').deleteOne({text: 'Do homework'}).then((result) => {
        //     console.log(result);
        // })


        //FIND ONE AND DELETE
        // db.collection('toDo').findOneAndDelete({completed: false}).then((result) =>{
        //     console.log(result);
        // });


        db.collection('Users').findOneAndDelete({_id: new ObjectID("5be87b8170c787dce70af89a")});
        


        client.close();
});