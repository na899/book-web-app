var express = require('express');
var bodyParser=require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url="mongodb://localhost:27017/bookweb";

var app = express();
var userID;
var searched;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

var search =require('./controller/search');
var book=require('./controller/book');
app.use(express.static('./files'));

MongoClient.connect(url,{useNewUrlParser:true}, function (err, dB) {
  if (err)
    throw err;
  console.log("Established connection with database");
  var db = dB;
  var userID;
  var dbo = db.db("bookweb");
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });})



book(app);
search(app);


app.listen(3000);
console.log("Listening on port 3000");



