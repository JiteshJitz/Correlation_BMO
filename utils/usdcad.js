const request = require('request');
const constants = require('../config');

const calHigh = (obs) => {

    let high = 0;
    for(let i = 0;i<obs.length;i++){
        console.log(obs[i].FXUSDCAD.v)
        if(high<obs[i].FXUSDCAD.v){
            high = obs[i].FXUSDCAD.v
            date = obs[i].d
        }
    }

    console.log("High ", high, " on ", date);

    return parseFloat(high);

}

const calLow = (obs) => {

    let low = obs[0].FXUSDCAD.v
    for(let i = 0;i<obs.length;i++){
        console.log(obs[i].FXUSDCAD.v)
        if(low>obs[i].FXUSDCAD.v){
            low = obs[i].FXUSDCAD.v
            date = obs[i].d
        }
    }

    console.log("Low ", low, " on ", date);

    return parseFloat(low);

}

const calAvg = (obs) => {

    sum = 0;
    for(let i = 0;i<obs.length;i++){
        console.log(obs[i].FXUSDCAD.v)
        sum = sum + parseFloat(obs[i].FXUSDCAD.v);
    }

    avg = sum/obs.length;

    //console.log("Average is ", avg );

    return avg;


}


const usdcadRates = (start_date,end_date, callback) => {
    
    //console.log(encodeURIComponent(start_date));
    //console.log(encodeURIComponent(end_date));
  
    const url = constants.usdcad.BASE_URL + encodeURIComponent(start_date) + constants.usdcad.END + encodeURIComponent(end_date);
    console.log(url);
    //callback(true);
    request({url, json:true}, (error, {body})=> {
        // console.log(body.observations[0].FXCADUSD.v)
        //console.log(body.observations);
        var avg = calAvg(body.observations);
        var high = calHigh(body.observations);
        var low = calLow(body.observations);

        if(error) {
            callback("Cannot fetch the data")
        }
        else{
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