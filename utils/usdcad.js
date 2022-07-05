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

    return {
        high:high,
        date:date
    };

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

    return {
        low:low,
        date:date
    };

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

        if(error) {
            callback("Cannot fetch the data")
        }
        else{
            callback(
                avg
            )
        }
    })
}

module.exports = usdcadRates;