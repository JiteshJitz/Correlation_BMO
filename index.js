
// importing the required modules
const { request } = require('express');
const express = require('express');
const path = require('path');
const parser = require("body-parser");
const http = require("http");

const app = express();

//accessing the js files from utils directory
const usdcadRates = require('./utils/usdcad');
const corraRates = require('./utils/corra');
const corNum = require('./utils/correlation');

//Defining port
const port = process.env.PORT || 3000


// Set the view engine
const viewsPath = path.join(__dirname,'./views');

app.set('view engine', 'ejs');
app.set('views',viewsPath);


app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())


// Get methods
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



// Post methods
app.post("/calculate", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    usdcadRates(from,to, (result) => {
        // Error handling
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        // If there are no errors
        else{
            res.render('pages/calculate', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        }
        
    })
    
});

app.post("/corraCalculate", function(req, res){
    var from = req.body.from;
    var to = req.body.to;
    
    corraRates(from,to, (result) => {
        // Error handling
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        // If there are no errors
        else{
            res.render('pages/corraCalculate', {average:result.avg,high:result.high,low:result.low,from:from,to:to})
        }
    })
});

app.post("/correlationCalculate", async (req, res) => {
    var from = req.body.from;
    var to = req.body.to;
    
    await corNum(from,to, (result) => {
        // Error handling
        if(result.result === 'Error'){
            console.log(result.message);
            res.render('pages/error',{error:result.message})
        }
        // If there are no errors
        else{
            res.render('pages/correlationCalculate', {corr:result,from:from,to:to})
        }
        
        
    })
    
});

app.listen(port, () => console.log('Listening to port: ',port));