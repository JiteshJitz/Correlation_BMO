const { request } = require('express');
const path = require('path');
const { usdcad } = require('./config');

var express = require('express');
var app = express();

const usdcadRates = require('./utils/usdcad');
const corraRates = require('./utils/corra');

const parser = require("body-parser");
const http = require("http");

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});
app.post("/calculate", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    var result = usdcadRates(from, to);
    res.render('pages/calculate', {from:from,to:to})
 });

app.listen(8080);
console.log('Server is listening on port 8080');