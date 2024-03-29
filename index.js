const axios = require("axios");
const fs = require("fs");
const express = require('express');
const app = express();

app.use(express.static('./views'))
app.set('view engine', 'ejs'); 

app.get('/', async (req, res) => {
    // getData();
    // let location = "areaType=region&areaCode=E12000007"
    let location = "E09000023"
    try {
        let data = await getData(location);
        console.log(data.clean[0].length)
        console.log("sending data")
        res.render("index", {data: JSON.stringify(data)});
    }
    catch (err){
        console.log(err)
        console.log("ERROR")
        res.send(err)
    }
});

app.get('/location', async (req, res) => {
    // get the location from req
    // break down areatype and areaname?
    console.log(req.query)
    let location = req.query.location;
    let dateType = req.query.date;
    // console.log(location)
    
    try {
        // use location to get specific data from gov.uk
        let data = await getData(location, dateType);
        // console.log(data["body"][0]);
        // send new data to the server
        res.send({data: JSON.stringify(data)});
    }
    catch (err){
        // console.log(err);
        res.send("error");
    }
});

// const port = process.env.PORT;
const port = 3001;
app.listen(port, () => console.log('Corona App listening on port', port));

const getData = async (location) => {
    console.log(location)
    let data = []

    // const structure1 = [
    //     "alertLevel",
    //     "newCasesByPublishDate",
    //     "newCasesBySpecimenDate",
    //     "newDeathsByDeathDate",
    //     "newDeathsByPublishDate",
    // ]
    
    // const structure2 = [
    //     "cumDeathsByDeathDate",
    //     "newCasesByPublishDateRollingRate",
    //     "newCasesByPublishDateRollingSum",
    //     "newCasesBySpecimenDateRollingRate",
    //     "newCasesBySpecimenDateChangePercentage",
    //     // "newCasesByPublishDateAgeDemographics"
    // ]    

    const structure = [
        // [
            "cumDeathsByDeathDate",
            "newCasesByPublishDateRollingRate",
            "newCasesByPublishDateRollingSum",
            "newCasesBySpecimenDateRollingRate",
            "newCasesByPublishDateAgeDemographics",
            "newCasesByPublishDate",
            "newCasesBySpecimenDate",
        // ],
        // [
            // "alertLevel",
            // "newCasesByPublishDate",
            // "newCasesBySpecimenDate",
            // "newDeathsByDeathDate",
            // "newDeathsByPublishDate",
        // ]
    ]
    // console.log(dataFields.length) 
    // dataFields.forEach(async function(structure){
        // console.log("for each", "s:", structure, "l:", location, "d:", dateType)
        let res = await fetchData(structure, location)
        // console.log("res", res)
        // console.log("res", res.data)
        data.push(...res.data)
    // })
    console.log(data)
    data.clean = await cleanData(data.body)
    // console.log(data.clean[0])
    // data.summary = await summary(data);
    return data;
};  // getData


async function fetchData(structure, location){
    console.log(structure, location)
    let structureString = "";
    structure.forEach(function(e){
        structureString += "metric" + "=" + e + "&";
    });
    structureString = structureString.trim("&");
    // location = "E06000029"
    const url = (
        // "https://api.coronavirus.data.gov.uk/v1/data?" + 
        "https://api.coronavirus.data.gov.uk/v1/data?" + 
        "areaType=ltla&areaCode=" + location + "&" + structureString + "format=json"
    );
    console.log(url);

    const { data, status, statusText } = await axios.get(url, { timeout: 10000 });

    if ( status >= 400 ){
        throw new Error(statusText);
    } else if (status != 200){
        throw new Error(statusText);        
    } else {
        console.log("data length:", data.length)
        // data.clean = await cleanData(data.body, dateType)
        // console.log(data.clean[0])
        return data
    }    
}

async function summary(data){
    // console.log("summary data");
    let rollingRate;
    let alertLevelValue;
    let alertLevelMsg;
    // for (let i = 0; i < data["body"].length; i++){

    //     if (typeof data["body"][i]["newCasesBySpecimenDateRollingRate"] === "number"){
    //         rollingRate = data["body"][i]["newCasesBySpecimenDateRollingRate"];
    //         break;
    //         // return {"rollingRate": rollingRate}
    //     }
    // }
    // for (let i = 0; i < data["body"].length; i++){
    //     // console.log("here")
    //     if (typeof data["body"][i]["alertLevel"] === "number"){    
    //         // console.log("here2")    
    //         alertLevelValue = data["body"][i]["alertLevelValue"];
    //         alertLevelMsg = data["body"][i]["alertLevelName"];
    //         break;
    //     }
    // }
    // console.log(rollingRate)
    return {
        areaName: data["body"][0]["areaName"],
        // rollingRate: rollingRate,
        // alertLevelValue: alertLevelValue,
        // alertLevelMsg: alertLevelMsg,
        areaCode: data["body"][0]["areaCode"]
    };
}

function cleanData(data){
    // console.log(data[0])

    // let tempAlertLevel = 6;
    // let tempAlertMsg = "National Lockdown";    
    
    let cleanData = data.reduce( (tot, curr, index, src) => {
        // let casesSpecDate;
        let cases;
        let cumDeaths;
        let deaths;
        // let sevenDayAverage;
        // let rollingRateSpecDate;
        let rollingRate;
        let alertLevel;
        let alertMsg;
        let firstVacDaily;
        let firstVacCum;
        let secVacDaily;
        let secVacCum;
        // Check if AlertLevel is null in the data or not
        // if (curr.alertLevel === null || curr.alertLevel === -99) {
        //     let i = index -1;
        //     alertLevel = tempAlertLevel;
        //     alertMsg = tempAlertMsg;             
        // } else {
        //     alertLevel = curr.alertLevelValue;
        //     alertMsg = curr.alertLevelName;
        //     tempAlertLevel = curr.alertLevelValue;
        //     tempAlertMsg = curr.alertLevelName;         
        // }

        // Cases - 1 = specimen date and 2 = publish date

        // if (dateType == 1){
            // cases = curr.casesDaily;
            // deaths = curr.deathsDaily;
            // cases = curr.casesDaily;  
            // deaths = curr.newDeathsByDeathDate;

            // if (curr.newCasesBySpecimenDateRollingRate === null){
            //     rollingRate = 0;
            // } else {
            //     rollingRate = curr.newCasesBySpecimenDateRollingRate;   
            // }

        // } else {
        //     cases = curr.newCasesByPublishDate;    
        //     deaths = curr.newDeathsByPublishDate;
        //     if (curr.newCasesByPublishDateRollingRate === null){
        //         rollingRate = 0;
        //     } else {
        //         rollingRate = curr.newCasesByPublishDateRollingRate;
        //     }
        // }

        // Daily Deaths
        if (curr.deathsDaily === null){
            deaths = 0;
        } else {
            deaths = curr.deathsDaily;
        }

        // Daily Cases
        if (curr.casesDaily === null){
            cases = 0;
        } else {
            cases = curr.casesDaily;
        }

        // Cumulative Deaths
        if (curr.deathsCumulative === null){
            cumDeaths = 0;
        } else {
            cumDeaths = curr.deathsCumulative;
        }

        // Daily Cases
        if (curr.casesCumulative === null){
            cumCases = 0;
        } else {
            cumCases = curr.casesCumulative;
        }
        let data = {
            date: curr.date,
            cases: cases,
            cumCases: cumCases,
            deaths: deaths,
            cumDeaths: cumDeaths,
            // rollingRate: rollingRate,
            // alertLevel: alertLevel,
            // alertMsg: alertMsg
        }
        console.log(data)
        tot.push(data) 
        // if ( cases + cumDeaths + deaths === 0){
        //     console.log(cases + cumDeaths + deaths)
        // } else {
        //     tot.push(data)            
        // }
        return tot;
    },[])
    
    
    cleanData.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    
    cleanData.reverse()
    // Why do we do this?:
    cleanData[cleanData.length-1]["cumDeaths"] = cleanData[cleanData.length-2]["cumDeaths"]
    
    console.log("clean data", cleanData[0])
    return cleanData;
}