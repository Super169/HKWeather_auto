module.exports.handler = handler;

const LBL = require('./JsonLabel.js');

var stormSignal = [
    "Stand By Signal No. 1",
    "Strong Wind Signal No. 3",
    "No. 8 Northeast Gale or Storm Signal",
    "No. 8 Northwest Gale or Storm Signal",
    "No. 8 Southeast Gale or Storm Signal",
    "No. 8 Southwest Gale or Storm Signal",
    "Increasing Gale or Storm Signal No. 9",
    "Hurricane Signal No. 10"
]

var rainSignal = [
    "Amber Rainstorm Warning Signal",
    "Red Rainstorm Warning Signal",
    "Black Rainstorm Warning Signal"
];

// http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml
function handler(parms, json, result) {
    //    json["WeatherWarningSummaryv2"] = {"url":"http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml", "status" : "Not ready"};
        var shortLabel = parms.shortLabel;
        if (result.error) return;
        var html = result.body;
        if (html == null) return;
        var weatherSignal = {};
        
        try {
            for (idx = 0; idx < stormSignal.length; idx++) {
                if (html.indexOf(stormSignal[idx]) > -1) {
                    weatherSignal[LBL.WS_TYPHOON(shortLabel)] = idx;
                    break;
                }
            }    
    
            for (idx = 0; idx < rainSignal.length; idx++) {
                if (html.indexOf(rainSignal[idx]) > -1) {
                    weatherSignal[LBL.WS_RAINSTORM(shortLabel)] = idx;
                    break;
                }
            }    
            weatherSignal[LBL.RESULT_READY(shortLabel)] = true;
            
        } catch(e) {
            console.log(e);
            weatherSignal[LBL.RESULT_READY(shortLabel)] = false;
        }    
        json[LBL.WS_ROOT(shortLabel)] = weatherSignal;
    }