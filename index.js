const express = require('express');
const hbs = require('hbs');
const path = require('path');
const { usdcad } = require('./config');
const app = express();

const usdcadRates = require('./utils/usdcad');

const port = process.env.PORT || 3000

const publicStaticDirPath = path.join(__dirname, './public');

const viewsPath = path.join(__dirname,'./templates/views');

const partialsPath = path.join(__dirname,'./templates/partials');


app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicStaticDirPath));

app.get('/',(req,res)=>{
    res.send('Correlation Assessment for BMO');
});

//localhost:3000/usdcad?start_date
app.get('/usdcad',(req,res)=>{
    // res.send('USD to CAD conversion');
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;

    usdcadRates(start_date,end_date, (result) => {
        console.log(result);
    })
    
});

app.get('/corra',(req,res)=>{
    res.send('CORRA rate');
});

app.get('/correlation',(req,res)=>{
    res.send('Correlation');
});

app.get('*',(req,res)=>{
    res.send('Page not found');
});


app.listen(port, () => console.log('Listening to port: ',port));