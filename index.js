// express microweb server
var express = require('express');
var app = express();
//Router
var route = express.Router();
var path = require('path');
// for parsing form data in json format
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// handling static resources
app.use(express.static(path.join(__dirname, 'public')));
// setup handlebars environment in express
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ defaultLayout: '', extname: '.hbs',partialsDir: __dirname + '/views/partials/'}));
// set environment
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views/pages/'));
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
var dynamo = require('dynamodb');
const Joi = require('joi');

// telling express to use routing
app.use ("/", route);
// express web server error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send({ "Error" : err.stack});
});

app.use("*", (req, res) => {
    res.status(404).send("404 - File Not Found!!!");
});

// start your web server to listen to incoming request
app.listen(app.get('port'), () => {
    console.log("Web server running on .... port " + app.get('port'));
});

// registering the Member CRUD 
var members = require('./routes/member');
route.get('/members', members.list);
route.get('/members/add', members.add);
route.post('/members/add', members.save);

route.use("/", function(req, res, next) {
    console.log("/" + req.method);
    next();
});

route.get("/", function(req, res) {
    res.redirect('/members');
});

route.use("/members", function(req, res, next) {
    console.log("/members" + req.method);
    next();
});

route.get("/members", function(req, res) {
    res.render('pages/index', {
        page: req.url
    });
});


