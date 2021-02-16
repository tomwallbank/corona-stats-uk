/*
*    cases-data.js
*    UK coronavirus case data
*/

function renderDeathsChart(data){
    
    let svg = d3.select("#death-chart-area")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr(
            'viewBox',
            '0 0 ' +
            (width + margin.left + margin.right) +
            ' ' +
            (height + margin.top + margin.bottom)
        )
    
    let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + 
                ", " + margin.top + ")");
    
    // X Label
    g.append("text")
        .attr("y", height + 40)
        .attr("x", width / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("class", "axis-title")
        .text("Date");
    
    // Y Label
    g.append("text")
        .attr("y", -45)
        .attr("x", -(height / 2))
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis-title")
        .text("Deaths - Cumulative");
    
    // Y Label2
    g.append("text")
        .attr("y", width + 60)
        .attr("x", -(height / 2))
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis-title")
        .text("Deaths - Daily");
        
    drawChart(data)
    
    function drawChart(cleanData){

    //////////////////////////////////
    // REMOVE OLD STUFF
    ///////////////
    svg.selectAll("rect").remove()
    svg.selectAll("circles").remove()
    svg.selectAll("path").remove()
    g.selectAll("g").remove()
    ////////////////////////
    
    let tempAlertLevel = 6;
    let tempAlertMsg = "National Lockdown";
    
    // X Scale
    let x = d3.scaleBand()
        .domain(cleanData.map(function(d){ return d.date }))
        .range([0, width])
        .padding(0.2);
    
    // Y Scale
    let y = d3.scaleLinear()
        .domain([0, d3.max(cleanData, function(d) { return d.cumDeaths })])
        .range([height, 0]);
    
    // Y Scale2
    let y2 = d3.scaleLinear()
        .domain([0, d3.max(cleanData, function(d) { return d.deaths }) * 1.25])
        .range([height, 0]);
    
    // scale for backgroun colour
    let colorScale = d3.scaleLinear()
        .domain([0, 6])
        .range(["white", "red"]);
    
    // X Axis
    let xAxisCall = d3.axisBottom(x)
        .tickValues(x.domain().filter(function(d,i){
            if (d.slice(8,10) === "01"){
                // console.log(d)
                return d3.timeFormat('%Y')(d)
                // return i            
            }  
        }))
    
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height +")")
        .call(xAxisCall)
            .selectAll("text")  
                .style("text-anchor", "middle")
                .attr("dx", "-.8em")
                .attr("dy", "0.75em")
    
    // Y Axis
    let yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d; });
    g.append("g")
        .attr("class", "y axis")
        // .attr("stroke", "steelblue")
        .call(yAxisCall);
    
    // Y Axis2
    let y2AxisCall = d3.axisRight(y2)
        .tickFormat(function(d){ return d; });
    g.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .attr("class", "y axis2")
        .call(y2AxisCall);
    
    // Bars
    let rectsG = g.append("g")
        .attr("class", "daily-deaths-bar")
    let rects = rectsG.selectAll("rect")
        .data(cleanData)
    
    rects.enter()
        .append("rect")
            .attr("y", function(d){ return y2(d.deaths); })
            .attr("x", function(d){ return x(d.date) })
            .attr("date", function(d) {return d.date})
            .attr("deaths", function(d) { return d.deaths})
            .attr("height", function(d){ return height - y2(d.deaths); })
            .attr("width", x.bandwidth)
            .attr("class", "deaths")
    
    // OVERLAY COLOUR BANDS REPRESENTING ALERT LEVEL
    // rects.enter()
    //     .append("rect")
    //         .attr("y", function(d){ return 0; })
    //         .attr("x", function(d){ return x(d.date) })
    //         .attr("alert", function(d) { return d.alertLevel})
    //         .attr("height", height)
    //         .attr("width", width/349)
    //         .attr("class", "alert-color")
    //         .attr("fill", function(d) { return colorScale(d.alertLevel)})
    
    // Line
    // Add the line
    g.append("path")
        .datum(cleanData)
        .attr("fill", "none")
        .attr("stroke", "rgb(0, 48, 120)")
        .attr("class", "cumulative-deaths")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()

        .x(function(d) { return x(d.date) })
        // .y(function(d) { return y2(d.sevenDayAverage) })
        .y(function(d) { return y(d.cumDeaths) })
        )
    
    
    /******************************** Tooltip Code ********************************/
    
    let focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none")
        .style("font-size", "10px")
        .style("font-weight", "bold")
    
    focus.append("rect")
        .attr("class", "deaths-bar-hover")
        .attr("fill", "black")
    
    focus.append("text")
        .attr("class", "deaths-bar-text")
    
    focus.append("text")
        .attr("class", "deaths-line-text")
    
    focus.append("circle")
        .attr("class", "deaths-line-hover deaths")
        .attr("r", 2.5);
    
    focus.append("text")
        .attr("class", "deaths-line-text")
    

    let focusLegend = focus.append("g")
    
    let focusWidth = 150;
    let focusHeight = 50;
    
    focusLegend.append("rect")
        .style("stroke", "black")
        .style("fill", "white")
        .style("stroke-width", 1)
        .attr("class", "focus-legend-rect focus-box hidden")
        .attr("height", focusHeight)
        .attr("width", focusWidth)
    
    focusLegend.append("text")
        .attr("class", "deaths-focus-heading rolling focus-box")
        .attr("x", 10)
        .attr("y", 10)
    
    focusLegend.append("text")
        .attr("class", "date-focus focus-date")
    
    focusLegend.append("text")
        .attr("class", "deaths-focus-text focus-box")
    
    // focusLegend.append("text")
    //     .attr("class", "rolling-focus-text focus-box")
    
    focusLegend.append("text")
        .attr("class", "cum-deaths-focus-text focus-box")
    
    let xOffset = 20
    let yOffset = 00
    
    let legend = g.append("g")
        .attr("class", "legend")
        // .style("display", "none")
        .style("font-size", "10px")
        .attr("dy", ".1em")
        .attr("text-anchor", "start");
    
    legend.append("text")
        .attr("class", "legend-title")
        .attr("transform", "translate("+ (xOffset + 10) + "," + (yOffset + 15) + ")")
        .text("Key")
    
    legend.append("rect")
        .attr("class", "deaths-bar deaths")
        .attr("width", 7.5)
        .attr("height", 2.5)
        .attr("transform", "translate("+ (xOffset + 7) + "," + (yOffset + 30) + ")")
    
    legend.append("text")
        .attr("class", "daily-deaths deaths")
        .attr("transform", "translate("+ (xOffset + 20) + "," + (yOffset + 32.5) + ")")
        .text("Daily Deaths")
    
    // legend.append("circle")
    //     .attr("class", "rolling-line-hover rolling")
    //     .attr("r", 2.5)
    //     .attr("transform", "translate("+ (xOffset + 10) + "," + (yOffset + 50) + ")")
    
    // legend.append("text")
    //     .attr("class", "rolling-cases rolling")
    //     .attr("transform", "translate("+ (xOffset + 20) + "," + (yOffset + 52.5) + ")")
    //     .text("Rolling Rate per 100k")
    
    legend.append("circle")
        .attr("class", "deaths-line-hover deaths")
        .attr("r", 2.5)
        .attr("transform", "translate("+ (xOffset + 10) + "," + (yOffset + 50) + ")")        
    
    legend.append("text")
        .attr("class", "deaths-line-text deaths")
        .attr("transform", "translate("+ (xOffset + 20) + "," + (yOffset + 52.5) + ")")
        .text("Cumulative Deaths")
    
    legend.append("text")
        .attr("class", "cum-deaths")
        .attr("transform", "translate(55,95)")
    
    // OVERLAY FOR MOUSE MOVEMENT
    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { 
            focus.select(".focus-legend-rect")
                .classed("hidden", false)
            focus.style("display", null); 
            // legend.style("display", null); 
        })
        .on("mouseout", function() { 
            focus.style("display", "none"); 
            focus.select(".focus-legend-rect")
                .classed("hidden", true)
            // legend.style("display", "none"); 
        })
        .on("mousemove", mousemove);
    
    function mousemove() {
        let focusOffsetX;
        let focusOffsetY;
        let coordinates= d3.mouse(this);
        let x0 = coordinates[0];
        let y0 = coordinates[1];
        let i = Math.floor(x0*((cleanData.length-1)/width))
        let d = cleanData[i]
        
        // focus.select(".rolling-line-hover").attr("cx", x(d.date) )
        // focus.select(".rolling-line-hover").attr("cy", y2(d.rollingRate))
        // focus.select(".rolling-line-text").attr("x", x(d.date) )
        // focus.select(".rolling-line-text").attr("y", y2(d.rollingRate) - 10)
        // focus.select(".rolling-line-text").text(d.rollingRate.toFixed(1))
    
        focus.select(".deaths-line-hover").attr("cx", x(d.date) )
        focus.select(".deaths-line-hover").attr("cy", y(d.cumDeaths))
        focus.select(".deaths-line-text").attr("x", x(d.date) )
        focus.select(".deaths-line-text").attr("y", y(d.cumDeaths) - 10)
        focus.select(".deaths-line-text").text(d.cumDeaths.toFixed(1))
    
        focus.select(".deaths-bar-hover")
            .attr("y", y2(d.deaths))
            .attr("x", x(d.date))
            .attr("date", d.date)
            .attr("cases", d.deaths)
            .attr("height", height - y2(d.deaths))
            .attr("width", x.bandwidth)
    
        focus.select(".deaths-bar-text")
            .attr("y", y2(d.deaths))
            .attr("x", x(d.date))
            .text(d.cases)
    
        focus.select(".focus-legend-rect")
            .attr("x", function(){
                if (x(d.date) < (width/2)){
                    focusOffsetX = x(d.date) + 25
                    return focusOffsetX
                } else {
                        focusOffsetX =  x(d.date) - focusWidth - 25
                    return focusOffsetX
                }
            })
            .attr("y", function(){
                if (y(d.cumDeaths) < (height/2 + 25) ) {
                    focusOffsetY = y(d.cumDeaths) + 0 
                    return focusOffsetY
                } else {
                    focusOffsetY = y(d.cumDeaths) - 70
                    return focusOffsetY
                }
            })
    
            let date = new Date(d.date)
            let dateString = date.toString().slice(4,7)
            focus.select(".date-focus")
                .attr("x", focusOffsetX + 10)
                .attr("y", focusOffsetY + 12.5)
                .text(date.toString().slice(8, 10) + " " + date.toString().slice(4, 7))
    
            focus.select(".deaths-focus-text").attr("x", focusOffsetX + 10 )
            focus.select(".deaths-focus-text").attr("y", focusOffsetY + 25 )
            focus.select(".deaths-focus-text").text("Daily Deaths: " + d.deaths.toFixed(1))            
    
            // focus.select(".rolling-focus-text").attr("x", focusOffsetX + 10 )
            // focus.select(".rolling-focus-text").attr("y", focusOffsetY + 35 )
            // focus.select(".rolling-focus-text").text("Rolling Rate: " + d.rollingRate.toFixed(1))            
    
            focus.select(".cum-deaths-focus-text").attr("x", focusOffsetX + 10 )
            focus.select(".cum-deaths-focus-text").attr("y", focusOffsetY + 35 )
            focus.select(".cum-deaths-focus-text").text("Cumulative Deaths: " + d.cumDeaths.toFixed(1))            
        
        }
    }

}

// export default { renderDeathsChart }

  
