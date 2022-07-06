const request = require('request');
const constants = require('../config');
const axios = require('axios');


const calculateCorrelation = (obj1,obj2) => {
    var corr = 0, numerator = 0, obj1Mean = 0, obj2Mean = 0, sumSquareObj1 = 0, sumSquareObj2 = 0;
    obj1Mean = meanValue(obj1);
    obj2Mean = meanValue1(obj2);

    //console.log("Obj2 mean ", obj2Mean);

    for(let i=0;i<obj1.length;i++){
        numerator = numerator + parseFloat((parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean) * (parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean));
        sumSquareObj1 = sumSquareObj1 + parseFloat((parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean) * (parseFloat(obj1[i]['AVG.INTWO'].v) - obj1Mean));
        sumSquareObj2 = sumSquareObj2 + parseFloat((parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean) * (parseFloat(obj2[i].FXUSDCAD.v) - obj2Mean));

    }

    corr = parseFloat(numerator) / parseFloat(Math.sqrt(sumSquareObj1*sumSquareObj2));
    
    //console.log("Correlation", corr);

    return corr;
}

const meanValue = (array) => {
    //console.log("Array ", array);
    let sum = 0;
    for(let i = 0; i<array.length; i++){
        sum = sum + parseFloat(array[i]['AVG.INTWO'].v);
    }

    //console.log("Sum ", sum)

    return sum/array.length
}

const meanValue1 = (array) => {
    //console.log("Array ", array);
    let sum = 0;
    for(let i = 0; i<array.length; i++){
        sum = sum + parseFloat(array[i].FXUSDCAD.v);
    }

    //console.log("Sum ", sum)

    return sum/array.length
}



const corNum =  async (start_date,end_date, callback) => {

    const url1 = constants.corra.BASE_URL + encodeURIComponent(start_date) + constants.corra.END + encodeURIComponent(end_date);
    const url2 = constants.usdcad.BASE_URL + encodeURIComponent(start_date) + constants.usdcad.END + encodeURIComponent(end_date);
    
    try {
        let obj1 = await axios.get(url1)
        //console.log(obj1.status);
        let obj2 = await axios.get(url2)
        //console.log(obj2.data.observations);

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
    catch(err){
        //console.log(err.response.status);
        console.log(err.response.data.message);
        callback({
            result: "Error",
            message: err.response.data.message
        })
    }

}


module.exports = corNum;