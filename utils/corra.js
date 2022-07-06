const request = require('request');
const constants = require('../config');

//Function to calculate and return the highest value of CORRA
const calHigh = (obs) => {

    let high = 0;
    for(let i = 0;i<obs.length;i++){
        
        if(high<obs[i]['AVG.INTWO'].v){
            high = obs[i]['AVG.INTWO'].v
            date = obs[i].d
        }
    }

    return parseFloat(high);

}

//Function to calulate and return the lowest value of CORRA
const calLow = (obs) => {

    let low = obs[0]['AVG.INTWO'].v
    for(let i = 0;i<obs.length;i++){
        
        if(low>obs[i]['AVG.INTWO'].v){
            low = obs[i]['AVG.INTWO'].v
            date = obs[i].d
        }
    }

    return parseFloat(low);

}

//Function to calculate and return the average value of CORRA
const calAvg = (obs) => {

    sum = 0;
    for(let i = 0;i<obs.length;i++){
        sum = sum + parseFloat(obs[i]['AVG.INTWO'].v);
    }

    avg = sum/obs.length;

    return avg;

}


const corraRates = (start_date,end_date, callback) => {
    
    // Construct the URL
    const url = constants.corra.BASE_URL + encodeURIComponent(start_date) + constants.corra.END + encodeURIComponent(end_date);

    // Fetch the data from Bank of canada Api
    request({url, json:true}, (error,response, {body})=> {


    //Error handling

        if(response.statusCode>=400) {
            callback({
                result: "Error",
                message: response.body.message

            })
        }
        else if(response.body.observations.length === 0){
            callback({
                result: "Error",
                message: "Type a valid date"

            })
        }

        // If there are no errors
        else{
            var avg = calAvg(response.body.observations);
            var high = calHigh(response.body.observations);
            var low = calLow(response.body.observations);

            callback({
                avg:avg.toFixed(2),
                high:high.toFixed(2),
                low:low.toFixed(2)
            } 
            )
        }
    })
}

module.exports = corraRates;