
let locationCode = "E09000023"
getRequest(locationCode, 1)


let margin = { left:80, right:80, top:50, bottom:100 };

let width = 1000 - margin.left - margin.right,
    height = 425 - margin.top - margin.bottom;
        

    // Functions
    function updateText(d){
        let areaName = document.querySelector("#areaName")
        areaName.innerHTML = d.summary.areaName
        
        let rollingSum = document.querySelector("#rollingSum")
        rollingSum.innerHTML = d.body[0].newCasesByPublishDateRollingSum
    
        let rollingRate = document.querySelector("#rollingRate")
        rollingRate.innerHTML = d.body[0].newCasesByPublishDateRollingRate
        
        let alertLevel = document.querySelector("#alertLevel")
        let alertLevelValue = document.querySelector("#alertLevelValue")
        
        if (d.summary.alertLevelValue === -99) {
            alertLevel.innerHTML="National Lockdown"
        } else {
            alertLevel.innerHTML = d.summary.alertLevel
            alertLevel.innerHTML = d.summary.alertLevelValue            
            let alertLevelMsg = document.querySelector("#alertLevelMsg")
            alertLevelMsg.innerHTML = d.summary.alertLevelMsg;
        }
        

    }
    
    let search = document.querySelector("#searchBox")
    let listDiv = document.querySelector("#list")
    
    // ADD EVENT LISTENERS 
    search.addEventListener("keyup", function(e){
        removeAllChildNodes(listDiv);
        
        console.log("keyup", e.key)
        if (search.value.length > 0) {
            
            listDiv.classList.remove("hidden")            
            let list = findLocation(areas, 'name', search.value);
            console.log("list", list)
            for (let i = 0; i < list.length; i++){
                console.log("list", list)
                console.log(i, list)
                let name = list[i]["name"];
                let div = document.createElement("div")
                div.innerHTML = name;
                div.classList.add("location-list")
                div.setAttribute("code", list[i]["code"])
    
                div.addEventListener("click", function(){
                    submit(div, name)    
                })

                listDiv.appendChild(div);
            }

        } else {
            listDiv.classList.add("hidden")
        }
        
        if (e.key === 'Enter' || e.keyCode === 13) {
            console.log("e", e)
            // let listDiv = document.querySelector("#list")
            let div = listDiv.firstChild
            console.log(listDiv)
            console.log("div", div)
            submit(div, name)
        } 
        // console.log(search.value);
    })
    
    // DROP DOWN FOR DATE TYPE
    let dropDown = document.getElementById("date-type");
        dropDown.addEventListener('change', (e) => {
            date = dropDown.value
            // let code = div.getAttribute("code")
            getRequest(locationCode, date)
            // drawChart(data);
    });
    
    // EVENT LISTENER FUNCTIONS
    function submit(div, name){
        console.log("submit")
        console.log("div:", div.innerHTML)
        console.log("name", name)
        search.value = div.innerHTML;
        console.log("ul", listDiv)
        removeAllChildNodes(listDiv);
        let date = document.querySelector("#date-type").value
        let code = div.getAttribute("code");
        locationCode = code;
        getRequest(code, date)
    };
    
    // AJAX GET REQUET
    function getRequest(code, date){
        let url =  "/location?location=" + locationCode +  "&date=" + date;
        console.log(url)
            
        const XHR = new XMLHttpRequest();
    
        XHR.open("GET", url);
        XHR.send();
    
        XHR.onreadystatechange = function(){
            if (XHR.readyState == 4) {
                if(XHR.status === 200) {
                    let d = JSON.parse(XHR.responseText)
                    data = JSON.parse(d.data)
                    // Clear old charts
                    
                    removeAllChildNodes(document.getElementById("case-chart-area"))
                    removeAllChildNodes(document.getElementById("death-chart-area"))    
                    // UPDATE CHART
                    // drawChart(data.clean)
                    // renderCombinedChart(data.clean)
                    renderCasesChart(data.clean)
                    renderDeathsChart(data.clean)
                    
                    // UPDATE TEXT
                    updateText(data)
                } else {
                    console.log("There was a problem");
                }
            }
        };        
        
    }
    
    let areas = [
        {"code":"E06000001","name":"Hartlepool"},
        {"code":"E06000002","name":"Middlesbrough"},
        {"code":"E06000003","name":"Redcar and Cleveland"},
        {"code":"E06000004","name":"Stockton-on-Tees"},
        {"code":"E06000005","name":"Darlington"},
        {"code":"E06000006","name":"Halton"},
        {"code":"E06000007","name":"Warrington"},
        {"code":"E06000008","name":"Blackburn with Darwen"},
        {"code":"E06000009","name":"Blackpool"},
        {"code":"E06000010","name":"Kingston upon Hull, City of"},
        {"code":"E06000011","name":"East Riding of Yorkshire"},
        {"code":"E06000012","name":"North East Lincolnshire"},
        {"code":"E06000013","name":"North Lincolnshire"},
        {"code":"E06000014","name":"York"},
        {"code":"E06000015","name":"Derby"},
        {"code":"E06000016","name":"Leicester"},
        {"code":"E06000017","name":"Rutland"},
        {"code":"E06000018","name":"Nottingham"},
        {"code":"E06000019","name":"Herefordshire, County of"},
        {"code":"E06000020","name":"Telford and Wrekin"},
        {"code":"E06000021","name":"Stoke-on-Trent"},
        {"code":"E06000022","name":"Bath and North East Somerset"},
        {"code":"E06000023","name":"Bristol, City of"},
        {"code":"E06000024","name":"North Somerset"},
        {"code":"E06000025","name":"South Gloucestershire"},
        {"code":"E06000026","name":"Plymouth"},
        {"code":"E06000027","name":"Torbay"},
        {"code":"E06000030","name":"Swindon"},
        {"code":"E06000031","name":"Peterborough"},
        {"code":"E06000032","name":"Luton"},
        {"code":"E06000033","name":"Southend-on-Sea"},
        {"code":"E06000034","name":"Thurrock"},
        {"code":"E06000035","name":"Medway"},
        {"code":"E06000036","name":"Bracknell Forest"},
        {"code":"E06000037","name":"West Berkshire"},
        {"code":"E06000038","name":"Reading"},
        {"code":"E06000039","name":"Slough"},
        {"code":"E06000040","name":"Windsor and Maidenhead"},
        {"code":"E06000041","name":"Wokingham"},
        {"code":"E06000042","name":"Milton Keynes"},
        {"code":"E06000043","name":"Brighton and Hove"},
        {"code":"E06000044","name":"Portsmouth"},
        {"code":"E06000045","name":"Southampton"},
        {"code":"E06000046","name":"Isle of Wight"},
        {"code":"E06000047","name":"County Durham"},
        {"code":"E06000049","name":"Cheshire East"},
        {"code":"E06000050","name":"Cheshire West and Chester"},
        {"code":"E06000051","name":"Shropshire"},
        {"code":"E06000052","name":"Cornwall and Isles of Scilly"},
        {"code":"E06000054","name":"Wiltshire"},
        {"code":"E06000055","name":"Bedford"},
        {"code":"E06000056","name":"Central Bedfordshire"},
        {"code":"E06000057","name":"Northumberland"},
        {"code":"E06000058","name":"Bournemouth, Christchurch and Poole"},
        {"code":"E06000059","name":"Dorset"},
        {"code":"E07000004","name":"Aylesbury Vale"},
        {"code":"E07000005","name":"Chiltern"},
        {"code":"E07000006","name":"South Bucks"},
        {"code":"E07000007","name":"Wycombe"},
        {"code":"E07000008","name":"Cambridge"},
        {"code":"E07000009","name":"East Cambridgeshire"},
        {"code":"E07000010","name":"Fenland"},
        {"code":"E07000011","name":"Huntingdonshire"},
        {"code":"E07000012","name":"South Cambridgeshire"},
        {"code":"E07000026","name":"Allerdale"},
        {"code":"E07000027","name":"Barrow-in-Furness"},
        {"code":"E07000028","name":"Carlisle"},
        {"code":"E07000029","name":"Copeland"},
        {"code":"E07000030","name":"Eden"},
        {"code":"E07000031","name":"South Lakeland"},
        {"code":"E07000032","name":"Amber Valley"},
        {"code":"E07000033","name":"Bolsover"},
        {"code":"E07000034","name":"Chesterfield"},
        {"code":"E07000035","name":"Derbyshire Dales"},
        {"code":"E07000036","name":"Erewash"},
        {"code":"E07000037","name":"High Peak"},
        {"code":"E07000038","name":"North East Derbyshire"},
        {"code":"E07000039","name":"South Derbyshire"},
        {"code":"E07000040","name":"East Devon"},
        {"code":"E07000041","name":"Exeter"},
        {"code":"E07000042","name":"Mid Devon"},
        {"code":"E07000043","name":"North Devon"},
        {"code":"E07000044","name":"South Hams"},
        {"code":"E07000045","name":"Teignbridge"},
        {"code":"E07000046","name":"Torridge"},
        {"code":"E07000047","name":"West Devon"},
        {"code":"E07000061","name":"Eastbourne"},
        {"code":"E07000062","name":"Hastings"},
        {"code":"E07000063","name":"Lewes"},
        {"code":"E07000064","name":"Rother"},
        {"code":"E07000065","name":"Wealden"},
        {"code":"E07000066","name":"Basildon"},
        {"code":"E07000067","name":"Braintree"},
        {"code":"E07000068","name":"Brentwood"},
        {"code":"E07000069","name":"Castle Point"},
        {"code":"E07000070","name":"Chelmsford"},
        {"code":"E07000071","name":"Colchester"},
        {"code":"E07000072","name":"Epping Forest"},
        {"code":"E07000073","name":"Harlow"},
        {"code":"E07000074","name":"Maldon"},
        {"code":"E07000075","name":"Rochford"},
        {"code":"E07000076","name":"Tendring"},
        {"code":"E07000077","name":"Uttlesford"},
        {"code":"E07000078","name":"Cheltenham"},
        {"code":"E07000079","name":"Cotswold"},
        {"code":"E07000080","name":"Forest of Dean"},
        {"code":"E07000081","name":"Gloucester"},
        {"code":"E07000082","name":"Stroud"},
        {"code":"E07000083","name":"Tewkesbury"},
        {"code":"E07000084","name":"Basingstoke and Deane"},
        {"code":"E07000085","name":"East Hampshire"},
        {"code":"E07000086","name":"Eastleigh"},
        {"code":"E07000087","name":"Fareham"},
        {"code":"E07000088","name":"Gosport"},
        {"code":"E07000089","name":"Hart"},
        {"code":"E07000090","name":"Havant"},
        {"code":"E07000091","name":"New Forest"},
        {"code":"E07000092","name":"Rushmoor"},
        {"code":"E07000093","name":"Test Valley"},
        {"code":"E07000094","name":"Winchester"},
        {"code":"E07000095","name":"Broxbourne"},
        {"code":"E07000096","name":"Dacorum"},
        {"code":"E07000098","name":"Hertsmere"},
        {"code":"E07000099","name":"North Hertfordshire"},
        {"code":"E07000102","name":"Three Rivers"},
        {"code":"E07000103","name":"Watford"},
        {"code":"E07000105","name":"Ashford"},
        {"code":"E07000106","name":"Canterbury"},
        {"code":"E07000107","name":"Dartford"},
        {"code":"E07000108","name":"Dover"},
        {"code":"E07000109","name":"Gravesham"},
        {"code":"E07000110","name":"Maidstone"},
        {"code":"E07000111","name":"Sevenoaks"},
        {"code":"E07000112","name":"Folkestone and Hythe"},
        {"code":"E07000113","name":"Swale"},
        {"code":"E07000114","name":"Thanet"},
        {"code":"E07000115","name":"Tonbridge and Malling"},
        {"code":"E07000116","name":"Tunbridge Wells"},
        {"code":"E07000117","name":"Burnley"},
        {"code":"E07000118","name":"Chorley"},
        {"code":"E07000119","name":"Fylde"},
        {"code":"E07000120","name":"Hyndburn"},
        {"code":"E07000121","name":"Lancaster"},
        {"code":"E07000122","name":"Pendle"},
        {"code":"E07000123","name":"Preston"},
        {"code":"E07000124","name":"Ribble Valley"},
        {"code":"E07000125","name":"Rossendale"},
        {"code":"E07000126","name":"South Ribble"},
        {"code":"E07000127","name":"West Lancashire"},
        {"code":"E07000128","name":"Wyre"},
        {"code":"E07000129","name":"Blaby"},
        {"code":"E07000130","name":"Charnwood"},
        {"code":"E07000131","name":"Harborough"},
        {"code":"E07000132","name":"Hinckley and Bosworth"},
        {"code":"E07000133","name":"Melton"},
        {"code":"E07000134","name":"North West Leicestershire"},
        {"code":"E07000135","name":"Oadby and Wigston"},
        {"code":"E07000136","name":"Boston"},
        {"code":"E07000137","name":"East Lindsey"},
        {"code":"E07000138","name":"Lincoln"},
        {"code":"E07000139","name":"North Kesteven"},
        {"code":"E07000140","name":"South Holland"},
        {"code":"E07000141","name":"South Kesteven"},
        {"code":"E07000142","name":"West Lindsey"},
        {"code":"E07000143","name":"Breckland"},
        {"code":"E07000144","name":"Broadland"},
        {"code":"E07000145","name":"Great Yarmouth"},
        {"code":"E07000146","name":"King's Lynn and West Norfolk"},
        {"code":"E07000147","name":"North Norfolk"},
        {"code":"E07000148","name":"Norwich"},
        {"code":"E07000149","name":"South Norfolk"},
        {"code":"E07000150","name":"Corby"},
        {"code":"E07000151","name":"Daventry"},
        {"code":"E07000152","name":"East Northamptonshire"},
        {"code":"E07000153","name":"Kettering"},
        {"code":"E07000154","name":"Northampton"},
        {"code":"E07000155","name":"South Northamptonshire"},
        {"code":"E07000156","name":"Wellingborough"},
        {"code":"E07000163","name":"Craven"},
        {"code":"E07000164","name":"Hambleton"},
        {"code":"E07000165","name":"Harrogate"},
        {"code":"E07000166","name":"Richmondshire"},
        {"code":"E07000167","name":"Ryedale"},
        {"code":"E07000168","name":"Scarborough"},
        {"code":"E07000169","name":"Selby"},
        {"code":"E07000170","name":"Ashfield"},
        {"code":"E07000171","name":"Bassetlaw"},
        {"code":"E07000172","name":"Broxtowe"},
        {"code":"E07000173","name":"Gedling"},
        {"code":"E07000174","name":"Mansfield"},
        {"code":"E07000175","name":"Newark and Sherwood"},
        {"code":"E07000176","name":"Rushcliffe"},
        {"code":"E07000177","name":"Cherwell"},
        {"code":"E07000178","name":"Oxford"},
        {"code":"E07000179","name":"South Oxfordshire"},
        {"code":"E07000180","name":"Vale of White Horse"},
        {"code":"E07000181","name":"West Oxfordshire"},
        {"code":"E07000187","name":"Mendip"},
        {"code":"E07000188","name":"Sedgemoor"},
        {"code":"E07000189","name":"South Somerset"},
        {"code":"E07000192","name":"Cannock Chase"},
        {"code":"E07000193","name":"East Staffordshire"},
        {"code":"E07000194","name":"Lichfield"},
        {"code":"E07000195","name":"Newcastle-under-Lyme"},
        {"code":"E07000196","name":"South Staffordshire"},
        {"code":"E07000197","name":"Stafford"},
        {"code":"E07000198","name":"Staffordshire Moorlands"},
        {"code":"E07000199","name":"Tamworth"},
        {"code":"E07000200","name":"Babergh"},
        {"code":"E07000202","name":"Ipswich"},
        {"code":"E07000203","name":"Mid Suffolk"},
        {"code":"E07000207","name":"Elmbridge"},
        {"code":"E07000208","name":"Epsom and Ewell"},
        {"code":"E07000209","name":"Guildford"},
        {"code":"E07000210","name":"Mole Valley"},
        {"code":"E07000211","name":"Reigate and Banstead"},
        {"code":"E07000212","name":"Runnymede"},
        {"code":"E07000213","name":"Spelthorne"},
        {"code":"E07000214","name":"Surrey Heath"},
        {"code":"E07000215","name":"Tandridge"},
        {"code":"E07000216","name":"Waverley"},
        {"code":"E07000217","name":"Woking"},
        {"code":"E07000218","name":"North Warwickshire"},
        {"code":"E07000219","name":"Nuneaton and Bedworth"},
        {"code":"E07000220","name":"Rugby"},
        {"code":"E07000221","name":"Stratford-on-Avon"},
        {"code":"E07000222","name":"Warwick"},
        {"code":"E07000223","name":"Adur"},
        {"code":"E07000224","name":"Arun"},
        {"code":"E07000225","name":"Chichester"},
        {"code":"E07000226","name":"Crawley"},
        {"code":"E07000227","name":"Horsham"},
        {"code":"E07000228","name":"Mid Sussex"},
        {"code":"E07000229","name":"Worthing"},
        {"code":"E07000234","name":"Bromsgrove"},
        {"code":"E07000235","name":"Malvern Hills"},
        {"code":"E07000236","name":"Redditch"},
        {"code":"E07000237","name":"Worcester"},
        {"code":"E07000238","name":"Wychavon"},
        {"code":"E07000239","name":"Wyre Forest"},
        {"code":"E07000240","name":"St Albans"},
        {"code":"E07000241","name":"Welwyn Hatfield"},
        {"code":"E07000242","name":"East Hertfordshire"},
        {"code":"E07000243","name":"Stevenage"},
        {"code":"E07000244","name":"East Suffolk"},
        {"code":"E07000245","name":"West Suffolk"},
        {"code":"E07000246","name":"Somerset West and Taunton"},
        {"code":"E08000001","name":"Bolton"},
        {"code":"E08000002","name":"Bury"},
        {"code":"E08000003","name":"Manchester"},
        {"code":"E08000004","name":"Oldham"},
        {"code":"E08000005","name":"Rochdale"},
        {"code":"E08000006","name":"Salford"},
        {"code":"E08000007","name":"Stockport"},
        {"code":"E08000008","name":"Tameside"},
        {"code":"E08000009","name":"Trafford"},
        {"code":"E08000010","name":"Wigan"},
        {"code":"E08000011","name":"Knowsley"},
        {"code":"E08000012","name":"Liverpool"},
        {"code":"E08000013","name":"St. Helens"},
        {"code":"E08000014","name":"Sefton"},
        {"code":"E08000015","name":"Wirral"},
        {"code":"E08000016","name":"Barnsley"},
        {"code":"E08000017","name":"Doncaster"},
        {"code":"E08000018","name":"Rotherham"},
        {"code":"E08000019","name":"Sheffield"},
        {"code":"E08000021","name":"Newcastle upon Tyne"},
        {"code":"E08000022","name":"North Tyneside"},
        {"code":"E08000023","name":"South Tyneside"},
        {"code":"E08000024","name":"Sunderland"},
        {"code":"E08000025","name":"Birmingham"},
        {"code":"E08000026","name":"Coventry"},
        {"code":"E08000027","name":"Dudley"},
        {"code":"E08000028","name":"Sandwell"},
        {"code":"E08000029","name":"Solihull"},
        {"code":"E08000030","name":"Walsall"},
        {"code":"E08000031","name":"Wolverhampton"},
        {"code":"E08000032","name":"Bradford"},
        {"code":"E08000033","name":"Calderdale"},
        {"code":"E08000034","name":"Kirklees"},
        {"code":"E08000035","name":"Leeds"},
        {"code":"E08000036","name":"Wakefield"},
        {"code":"E08000037","name":"Gateshead"},
        {"code":"E09000002","name":"Barking and Dagenham"},
        {"code":"E09000003","name":"Barnet"},
        {"code":"E09000004","name":"Bexley"},
        {"code":"E09000005","name":"Brent"},
        {"code":"E09000006","name":"Bromley"},
        {"code":"E09000007","name":"Camden"},
        {"code":"E09000008","name":"Croydon"},
        {"code":"E09000009","name":"Ealing"},
        {"code":"E09000010","name":"Enfield"},
        {"code":"E09000011","name":"Greenwich"},
        {"code":"E09000012","name":"Hackney and City of London"},
        {"code":"E09000013","name":"Hammersmith and Fulham"},
        {"code":"E09000014","name":"Haringey"},
        {"code":"E09000015","name":"Harrow"},
        {"code":"E09000016","name":"Havering"},
        {"code":"E09000017","name":"Hillingdon"},
        {"code":"E09000018","name":"Hounslow"},
        {"code":"E09000019","name":"Islington"},
        {"code":"E09000020","name":"Kensington and Chelsea"},
        {"code":"E09000021","name":"Kingston upon Thames"},
        {"code":"E09000022","name":"Lambeth"},
        {"code":"E09000023","name":"Lewisham"},
        {"code":"E09000024","name":"Merton"},
        {"code":"E09000025","name":"Newham"},
        {"code":"E09000026","name":"Redbridge"},
        {"code":"E09000027","name":"Richmond upon Thames"},
        {"code":"E09000028","name":"Southwark"},
        {"code":"E09000029","name":"Sutton"},
        {"code":"E09000030","name":"Tower Hamlets"},
        {"code":"E09000031","name":"Waltham Forest"},
        {"code":"E09000032","name":"Wandsworth"},
        {"code":"E09000033","name":"Westminster"}
    ]
    
    // SEARCH FULL ARRAY OF LOCATIONS AND RETURN LIST OF MATCHES
    function findLocation(array, key, value) {
        let list = []
        for (var i = 0; i < array.length; i++) {
            let k = array[i][key].slice(0, value.length)
            if (k.toLowerCase() === value.toLowerCase()) {
                list.push(array[i])
            }
        }
        return list;
    }
    
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
