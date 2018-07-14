const request = require("request-promise");
var bodyParser = require('body-parser');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/bookweb";
var bcrypt = require('bcryptjs');

module.exports = function(app) {



    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.get('/login', (req, res) => {


        res.render('login.ejs');

    });



    app.get('/signup', (req, res) => {

        res.render('signup.ejs');


    });


    app.post('/signup', (req, res) => {



        // req.body.sanitized = req.sanitize(JSON.stringify(req.body));
        var exist = 1;
        var item = req.body;
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function(err, dB) {
            if (err) throw err;
            var db = dB.db('bookweb');

            db.collection("users").findOne({
                username: item.username
            }, function(err, result) {
                if (err) throw err;
                if (result != undefined)
                    exist = 0;
                else
                    console.log("!!!!!!!!");
                if (exist == 0)
                    res.send('Username taken...Try a different name or Log in if you have an user');
                else {
                    console.log(exist);

                    item.pass = bcrypt.hashSync(item.pass, 10);
                    item.like = [];
                    item.fav = [];
                    item.statusBooks = [];
                    item.shelf = [];
                    console.log(result);

                    db.collection('users').insertOne(item, (err, results) => {
                        console.log('inn');
                        if (err) return console.log(err)

                        console.log('user added')
                        res.redirect('/login')
                    });
                    dB.close();

                }




            })

            if (err) throw err;

            console.log('===========');
            if (exist == 0)
                dB.close();

        });

    })

    app.get('/',(req,res)=>{
        console.log("get home");
        res.render('home.ejs',{items:[]});
    })




    app.post('/authenticate', (req, res) => {

        var item = req.body;
        var check = 0;

        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function(err, dB) {
            if (err) throw err;
            var db = dB.db("bookweb");
            db.collection("users").find({
                username: item.username
            }).toArray(function(err, result) {
                if (err) throw err;
                check = result[0];
                console.log("INNNNNNNNNNN");



                if (bcrypt.compareSync(item.password, check.pass)) {
                    userID = item.username;
                    console.log(userID);
                    // req.session.user = userID;
                    //console.log(req.session.user);

                    db.collection('users').findOne({
                        username: userID
                    }, function(err, doc) {
                        if (err) throw err;
                        console.log("==========================*********==================");
                        console.log(doc.like);

                        res.redirect('/');
                        dB.close();

                    });




                }
                else {
                    res.send("Wrong Credentials!")

                    // Passwords don't match

                    dB.close();
                }


            });

            //console.log(result);

        })

        console.log('hello');


    });

    app.post('/', (req, res) => {
        var query = req.body.title;
        searched=query;

        test(query, function(item) {
           // console.log(item);
            res.render('home.ejs', {
                items: item
            })
        });



    })





}




function test(query, callback) {
    console.log('tested');

    const options = {
        method: "GET",
        uri: "https://www.googleapis.com/books/v1/volumes?q=" + query,
        json: true
    }

    return request(options).then(ctx => {

        return callback(ctx.items);
    }).catch(error => {
        return callback(error);
    });
}