module.exports.handler = handler;

const LBL = require('./JsonLabel.js');

const weekdayShort = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

// http://www.weather.gov.hk/wxinfo/currwx/fnd.htm
function handler(parms, json, result) {
    //    json["Forecast"] = {"url":"http://www.weather.gov.hk/wxinfo/currwx/fnd.htm", "status" : "Not ready"};
    
        var shortLabel = parms.shortLabel;
        if (result.error) return;
        var html = result.body;
        if (html == null) return;
        var forecastInfo = [];
    
        try {
            var pics = html.match(/\/images\/wxicon\/pic([0-9][0-9])[.]png/g);
            var dates = html.match(/<td style="background-position-y: -100px;(.|\n|\r)*?<\/td>/g);
            if ((pics.length != 9 ) || (dates.length != 9)) return;
            var tempDataHigh = html.match("Forecasted Highest(.|\r|\n)*?data: .*?([-|0-9].*?)]");
            if (tempDataHigh.length != 3) return;
            var tempDataLow =  html.match("Forecasted Lowest(.|\r|\n)*?data: .*?([-|0-9].*?)]");
            if (tempDataLow.length != 3) return;
            var THs = tempDataHigh[2].split(",");
            var TLs = tempDataLow[2].split(",");
            if ((THs.length != 9) || (TLs.length != 9)) return;
    
            var idx;
            for (idx = 0; idx < 9; idx++) {
                var forecastDay = {};
                forecastDay[LBL.FC_INDEX(shortLabel)] = idx;
                forecastDay[LBL.FC_PICTURE_ICON(shortLabel)] = parseInt(pics[idx].substring(18,20), null);
                var date = dates[idx].match("\t([0-9 A-Za-z]+)<br>[(](.*?)[)]\r");
                if (date.length==3) {
                    forecastDay[LBL.FC_DATE(shortLabel)] = date[1];
                    forecastDay[LBL.FC_WEEKDAY(shortLabel)] = weekdayShort.indexOf(date[2]);
                    forecastDay[LBL.FC_WEEKDAY_DESC(shortLabel)] = date[2];
                }
                forecastDay[LBL.FC_TEMP_LOW(shortLabel)] = parseInt(TLs[idx], null);
                forecastDay[LBL.FC_TEMP_HIGH(shortLabel)] = parseInt(THs[idx], null);
                forecastInfo.push(forecastDay);
            }
            forecastInfo[LBL.RESULT_READY(shortLabel)] = (forecastInfo.length == 9);
        } catch(e) {
            console.log(e);
            forecastInfo[LBL.RESULT_READY(shortLabel)] = false;
        }
        json[LBL.FC_ROOT(shortLabel)] = forecastInfo;
    }
    