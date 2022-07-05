const request = require('request');
const constants = require('../config');






const usdcadRates = (start_date,end_date, callback) => {
    
    //console.log(encodeURIComponent(start_date));
    //console.log(encodeURIComponent(end_date));
  
    const url = constants.usdcad.BASE_URL + encodeURIComponent(start_date) + constants.usdcad.END + encodeURIComponent(end_date);
    console.log(url);
    //callback(true);
    request({url, json:true}, (error, {body})=> {
        console.log(body)
        if(error) {
            callback("Cannot fetch the data")
        }
        else{
            callback(true)
        }
    })
}

module.exports = usdcadRates;