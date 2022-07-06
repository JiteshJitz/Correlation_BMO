const request = require('request');
const constants = require('../config');

// Function that calculates and returns the highest value USD/CAD data
const calHigh = (obs) => {
    let high = 0;
    for(let i = 0;i<obs.length;i++){
        if(high<obs[i].FXUSDCAD.v){
            high = obs[i].FXUSDCAD.v
            date = obs[i].d
        }
    }
    return parseFloat(high);
}

// Function that calculates and returns the lowest value USD/CAD data
const calLow = (obs) => {
    let low = obs[0].FXUSDCAD.v
    for(let i = 0;i<obs.length;i++){
        if(low>obs[i].FXUSDCAD.v){
            low = obs[i].FXUSDCAD.v
            date = obs[i].d
        }
    }
    return parseFloat(low);
}


// Function that calculates and returns the average value USD/CAD data
const calAvg = (obs) => {
    sum = 0;
    for(let i = 0;i<obs.length;i++){
        sum = sum + parseFloat(obs[i].FXUSDCAD.v);
    }
    avg = sum/obs.length;
    return avg;
}


const usdcadRates = (start_date,end_date, callback) => {
    
    //Constuct the url of USD/CAD data
    const url = constants.usdcad.BASE_URL + encodeURIComponent(start_date) + constants.usdcad.END + encodeURIComponent(end_date);

    // Get the data using the url
    request({url, json:true}, (error,response, {body})=> {
    
        //Error handling
    if(response.statusCode>=400) {
        callback({
            result: "Error",
            message: response.body.message
        })
        }
    else if(response.body.observations.length === 0){
        console.log("Type a valid date")
        callback({
            result: "Error",
            message: "Type a valid date"

        })
    }
    // Get the data if there are no errors
    else{
        var avg = calAvg(response.body.observations);
        var high = calHigh(response.body.observations);
        var low = calLow(response.body.observations);
        callback(
            {
            avg:avg.toFixed(2),
            high:high.toFixed(2),
            low:low.toFixed(2)
            }
        )
    }
    })
}

module.exports = usdcadRates;









// const meanValue = (array) => {
//     let sum = 0;
//     for(let i = 0; i<array.length; i++){
//         sum = sum + parseFloat(array[i]);
//     }

//     return sum/array.length
// }