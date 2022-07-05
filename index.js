const { request } = require('express');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const parser = require("body-parser");
const http = require("http");
const { usdcad } = require('./config');
const app = express();

const usdcadRates = require('./utils/usdcad');
const corraRates = require('./utils/corra');

const port = process.env.PORT || 3000

const publicStaticDirPath = path.join(__dirname, './public');

const viewsPath = path.join(__dirname,'./views');

app.set('view engine', 'ejs');
app.set('views',viewsPath);
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

app.use(express.static(publicStaticDirPath));

app.get('/',(req,res)=>{
    res.render('pages/index');
});

//localhost:3000/usdcad?start_date
// app.get('/usdcad',(req,res)=>{
//     res.send('USD to CAD conversion');
//     const start_date = req.query.start_date;
//     const end_date = req.query.end_date;

//     usdcadRates(start_date,end_date, (result) => {
//         console.log(result,"Result");
//     })
    
// });

app.get('/corra',(req,res)=>{
    res.render('pages/corra');
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    // corraRates(start_date,end_date, (result) => {
    //     console.log(result);
    // })
});

app.get('/correlation',(req,res)=>{
    res.render('pages/corrrelation');
});

app.get('*',(req,res)=>{
    res.send('Page not found');
});


app.post("/calculate", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    usdcadRates(from,to, (result) => {
        res.render('pages/calculate', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        
    })
    
 });

 app.post("/corraCal", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    corraRates(from,to, (result) => {
        res.render('pages/corraCal', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        
    })
    
 });

app.listen(port, () => console.log('Listening to port: ',port));