//-----------MUKHILAN.A.M-------------

const express = require('express');              //express recieved as function
const app = express();                           //express fn stored as object in app
const bodyparser = require('body-parser');       
const exhbs = require('express-handlebars');     //express-handlebars recieved
const dbo = require('./db');    //db.js is imported
const ObjectID = dbo.ObjectID; //ObjectID fn imported

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))     //An engine named hbs is registered
app.set('view engine','hbs');        //Engine is set named hbs
app.set('views','views');            //views set as views folder(html storinf=g area)
app.use(bodyparser.urlencoded({extended:true}));  //Body parser as middleware


app.get('/',async (req,res)=>{       
    let database = await dbo.getDatabase();  //db is recieved
    const collection = database.collection('books');   //Collection books is created and recieved
    const cursor = collection.find({})    //elements of collection recieved as cursor obj
    let books = await cursor.toArray();   //cursor obj converted to Array so we can seeit

    let message=''
    let edit_id, edit_book;

    if(req.query.edit_id){  //when edit id sent as query
        edit_id = req.query.edit_id;    //edit_id recieved from query
        edit_book = await collection.findOne({_id:ObjectID(edit_id)})  //object of the id storedin edit.book  
    }

    if (req.query.delete_id) {
        await collection.deleteOne({_id:ObjectID(req.query.delete_id)}) //Deleted book in that id
        return res.redirect('/?status=3');  //status=3 returned to /
    }

    switch (req.query.status) {  //Display CRUD success
        case '1':
            message = 'Inserted Succesfully!';
            break;
        case '2':
            message = 'Updated Succesfully!';
            break;
        case '3':
            message = 'Deleted Succesfully!';
            break;
        default:
            break;
    }
    res.render('main',{message,books,edit_id,edit_book}) //books array is sent to main.hbs
})

app.post('/store_book',async (req,res)=>{
    let database = await dbo.getDatabase();  //db recieves
    const collection = database.collection('books');  //books collection recieved

    //A book object is created from details given in the form
    let book = { title: req.body.title, author: req.body.author  };
    await collection.insertOne(book); //book object inserted into collection
    return res.redirect('/?status=1'); //redirected to "/" page with status=1
})

app.post('/update_book/:edit_id',async (req,res)=>{
    let database = await dbo.getDatabase();
    const collection = database.collection('books');
    let book = { title: req.body.title, author: req.body.author  };  //obj creted with value given in edit form
    let edit_id = req.params.edit_id;  //recieve edit_id from url as it is in :

    await collection.updateOne({_id:ObjectID(edit_id)},{$set:book}); //in id update object with new book
    return res.redirect('/?status=2');  // redirected to home, status=2 sent
})




app.listen(8000)