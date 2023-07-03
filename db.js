//-----------MUKHILAN.A.M-------------

const mongodb = require('mongodb');        //mongodb module imported
const MongoClient = mongodb.MongoClient;   //mongoclient function is stored,to connect to db
const ObjectID = mongodb.ObjectId;      //to use ObjectID in app.js 

let database;        //db constant is created

async function getDatabase(){          //fn to get db
    //connecting to local db
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); 
    //await is used as it returns promise

    database = client.db('library');  //client=local mongodb server,.db=database
    //database library is created and recieved inside database

    if (!database) {  //db not got
            console.log('Database not connected');
    }

    return database;   //database returned
}

module.exports = {     //exPorted to be used in app.js
    getDatabase,
    ObjectID
}