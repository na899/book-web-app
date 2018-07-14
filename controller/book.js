var bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/bookweb";
var bcrypt = require('bcryptjs');

module.exports = function(app) {

    /*var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());*/
    var id = undefined;

    app.post('/like', (req, res) => {

        console.log('liked');
        id = req.body.id;


        test(id, function(item) {



            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function(err, db) {
                if (err) throw err;
                var dbo = db.db("bookweb");
                var myquery = {
                    username: userID
                };
                var flag = true;
                var pos = 0;
                var liked;

                dbo.collection('users').findOne(myquery, function(err, doc) {

                    console.log('===============================');
                    console.log(doc);
                    for (var i = 0; i < doc.like.length; i++) {
                        if (doc.like[i].id == id)
                            flag = false;
                    }
                    pos = doc.like.length;
                    liked=doc.like;
                    console.log("==============================");
                    console.log(pos);
                    console.log(liked);

                    db.close();
                });

                
                if (flag == true) {
                    if(liked==undefined)
                        liked=[];
                    console.log('******************************')
                    console.log(pos);
                    console.log(liked);


                    liked[pos]=item;
                    var newvalues = {
                    $set: {
                        like:liked

                    }
                };

                    dbo.collection("users").updateOne(myquery, newvalues, function(err, results) {
                        if (err) throw err;
                        else
                            console.log("book liked");
                    
                        res.render('book.ejs', {
                            item: item[0]
                        })
                    });

                    //console.log(res);




                }



            });








        });


    });

    app.get('/book', (req, res) => {

        console.log("get book")

        console.log("heyyy");

        console.log(id);
        res.render('book.ejs');

    });

    app.post('/book', (req, res) => {
        console.log('============================');
        console.log(req.body);
        index = req.body.index;
        test(searched, function(item) {
            console.log(item);
            res.render('book.ejs', {
                item: item[index]
            })
        });
        console.log(":))");
    })


}




const request = require("request-promise");



function test(query, callback) {

    const options = {
        method: "GET",
        uri: "https://www.googleapis.com/books/v1/volumes?q=" + query,
        json: true
    }

    return request(options).then(ctx => {
        console.log(ctx.items);


        return callback(ctx.items);
    }).catch(error => {
        return callback(error);
    });
}