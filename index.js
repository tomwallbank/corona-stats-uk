const axios = require("axios");
const fs = require("fs");
const express = require('express');
const app = express();

app.use(express.static('views'))
app.set('view engine', 'ejs'); 

app.get('/', async (req, res) => {
    // getData();
    try {
        let data = await getData();
        console.log(data["body"][0])

        res.render("index", {data: JSON.stringify(data)});
    }
    catch {
        res.send("error")
    }
});

app.listen(3000, () => console.log('Corona app listening on port 3000!'));

const getData = async () => {

    const structure = [
        "alertLevel",
        "newCasesByPublishDate",
        "newCasesBySpecimenDate",
        "newDeathsByDeathDate",
        "cumDeathsByDeathDate",
        "newCasesByPublishDateRollingRate",
        "newCasesByPublishDateRollingSum",
        "newCasesBySpecimenDateRollingRate",
        "newCasesBySpecimenDateChangePercentage",
        "newCasesByPublishDateAgeDemographics"
    ]

// https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=utla&areaCode=E09000023&structure={"date":"date", "newCasesByPublishDateAgeDemographics":"newCasesByPublishDateAgeDemographics"}
// https://api.coronavirus.data.gov.uk/v2/data?areaType=utla&areaCode=E09000023&metric=newCasesByPublishDateAgeDemographics&format=csv
    let structureString = "";
    structure.forEach(function(e){
     structureString += "metric" + "=" + e + "&";
    });
    structureString = structureString.trim("&");

    const url = (
        'https://api.coronavirus.data.gov.uk/v2/data?' + 
        'areaType=ltla&areaCode=E09000023&' + structureString + "format=json"
    );
    console.log(url)

    const { data, status, statusText } = await axios.get(url, { timeout: 10000 });

    if ( status >= 400 ){
        console.log(statusText)
        throw new Error(statusText);
    } else if (status != 200){
        console.log(status)
        throw new Error(statusText);        
    } else {
        console.log(statusText)
    }
    console.log(status)
    console.log(statusText)
    data.summary = await summary(data)
    return data
};  // getData

async function summary(data){
    console.log("summary data")
    let rollingRate;
    let arlertLevelValue;
    let alertLevelMsg;
    for (let i = 0; i < data["body"].length; i++){

        if (typeof data["body"][i]["newCasesBySpecimenDateRollingRate"] === "number"){
            rollingRate = data["body"][i]["newCasesBySpecimenDateRollingRate"]
            break;
            // return {"rollingRate": rollingRate}
        }
    }
    for (let i = 0; i < data["body"].length; i++){
        // console.log("here")
        if (typeof data["body"][i]["alertLevel"] === "number"){    
            // console.log("here2")    
            alertLevelValue = data["body"][i]["alertLevelValue"]
            alertLevelMsg = data["body"][i]["alertLevelName"]
            break;
        }
    }
    // console.log(rollingRate)
    return {
        areaName: data["body"][0]["areaName"],
        rollingRate: rollingRate,
        alertLevelValue: alertLevelValue,
        alertLevelMsg: alertLevelMsg
    }
}