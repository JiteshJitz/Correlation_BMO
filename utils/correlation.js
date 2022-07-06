const request = require('request');
const constants = require('../config');
const axios = require('axios');

// Function to calculate the coeffecients for USD/CAD and CORRA and returns the coeffecient value
const calculateCorrelation = (obj1,obj2) => {

    // Formula correlation = sum(xi-xi')*(yi-yi')/sqrt(sum(xi-xi)^2 * sum(yi-yi')^2) where xi' and yi' are mean value of x and y respectfully
    // In ourcase obj1 and obj2 are x and y.

    var corr = 0, numerator = 0, obj1Mean = 0, obj2Mean = 0, sumSquareObj1 = 0, sumSquareObj2 = 0;
    obj1Mean = meanValue(obj1);
    obj2Mean = meanValue1(obj2);

    for(let i=0;i<obj1.length;i++){
        numerator = numerator + parseFloat((parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean) * (parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean));
        sumSquareObj1 = sumSquareObj1 + parseFloat((parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean) * (parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean));
        sumSquareObj2 = sumSquareObj2 + parseFloat((parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean) * (parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean));

    }
    corr = parseFloat(numerator) / parseFloat(Math.sqrt(sumSquareObj1*sumSquareObj2));
    return corr;
}

// Calculate mean value for CORRA data
const meanValue = (array) => {
    let sum = 0;
    for(let i = 0; i<array.length; i++){
        sum = sum + parseFloat(array[i]['AVG.INTWO'].v);
    }
    return sum/array.length
}

// Calculate mean value for USD/CAD data
const meanValue1 = (array) => {
    let sum = 0;
    for(let i = 0; i<array.length; i++){
        sum = sum + parseFloat(array[i].FXUSDCAD.v);
    }
    return sum/array.length
}

const corNum =  async (start_date,end_date, callback) => {

    //Declate the URLS
    const url1 = constants.corra.BASE_URL + encodeURIComponent(start_date) + constants.corra.END + encodeURIComponent(end_date);
    const url2 = constants.usdcad.BASE_URL + encodeURIComponent(start_date) + constants.usdcad.END + encodeURIComponent(end_date);
    
    try {

        // Fetch data using axios
        let obj1 = await axios.get(url1)
        let obj2 = await axios.get(url2)

        //more error handling
        if(obj1.data.observations.length === 0){
            callback({
                result: "Error",
                message: "Type a valid date"

            })
        }
        else if(obj2.data.observations.length === 0){
            callback({
                result: "Error",
                message: "Type a valid date"
            })
        }
        else{
            var correlationNum = calculateCorrelation(obj1.data.observations,obj2.data.observations);
            callback(correlationNum.toFixed(3))
        }        
    }
    //Catch if there is any error
    catch(err){
        callback({
            result: "Error",
            message: err.response.data.message
        })
    }
}


module.exports = corNum;