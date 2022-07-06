const { request } = require('express');
const express = require('express');
const path = require('path');
const parser = require("body-parser");
const http = require("http");

const app = express();

const usdcadRates = require('./utils/usdcad');
const corraRates = require('./utils/corra');
const corNum = require('./utils/correlation');


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


app.get('/corra',(req,res)=>{
    res.render('pages/corra');
});

app.get('/correlation',(req,res)=>{
    res.render('pages/corrrelation');
});

app.get('*',(req,res)=>{
    res.render('pages/error',{error:"Page not found"})
});


app.post("/calculate", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    usdcadRates(from,to, (result) => {
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        else{
            res.render('pages/calculate', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        }
        
    })
    
});

app.post("/corraCal", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    corraRates(from,to, (result) => {
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        else{
            res.render('pages/corraCal', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        }
        
        
    })
    
});

app.post("/corCal", async (req, res) => {
    var from = req.body.from;
    var to = req.body.to;
    
    await corNum(from,to, (result) => {
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        else{
            res.render('pages/corCal', {corr:result,from:from,to:to})
        }
        
        
    })
    
});

app.listen(port, () => console.log('Listening to port: ',port));