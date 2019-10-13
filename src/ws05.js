module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');

const weekdayLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


// http://rss.weather.gov.hk/rss/SeveralDaysWeatherForecast.xml
function handler(parms, json, result) {
    //    json["SeveralDaysWeatherForecast"] = {"url":"http://rss.weather.gov.hk/rss/SeveralDaysWeatherForecast.xml", "status" : "Not ready"};
    
        var shortLabel = parms.shortLabel;
        if (result.error) return;
        var html = result.body;
        if (html == null) return;
        var severalDays = [];
    
        try {
            var cdata, regex, reulst;
            var output = [];
    
            html = UTIL.simplifyHtml(html);
    
            // for faster search on CDATA only if possible
            regex = "<![\[]CDATA[\[](.*)]]>";
            result = html.match(regex);
            if ((result!=null) && (result.length>1)) cdata = result[1];
            else cdata = html;
    
            var forecast = html.match(/<p\/> Date\/Month: .*?<p\/>/g);
            // if ((result!=null) && (result.length>1)) console.log(result[1]);
            if (forecast.length == 9) {
                var idx;
                for (idx = 0; idx < 9; idx++) {
                    var dayForecast = {};
                    dayForecast[LBL.SF_INDEX(shortLabel)] = idx;
    
                    var data = forecast[idx];
                   
                    var result;
    
                    result = data.match("Month: ([0-9][0-9]/[0-9][0-9]) [(](.*?)[)]");
                    if ((result!=null) && (result.length>1)) dayForecast[LBL.SF_DATE(shortLabel)] = result[1];
                    if ((result!=null) && (result.length>2)) {
                        dayForecast[LBL.SF_WEEKDAY(shortLabel)]= weekdayLong.indexOf(result[2]);
                        dayForecast[LBL.SF_WEEKDAY_DESC(shortLabel)]= result[2];
                    }
    
                    result = data.match("Temp range: (-?[0-9]+) - (-?[0-9]+)");
                    if ((result!=null) && (result.length>2)) {
                        dayForecast[LBL.SF_TEMP_LOW(shortLabel)] = parseInt(result[1]);
                        dayForecast[LBL.SF_TEMP_HIGH(shortLabel)] = parseInt(result[2]);
                    }    
                    result = data.match("R.H. range: (-?[0-9]+) - (-?[0-9]+)");
                    if ((result!=null) && (result.length>2)) {
                        dayForecast[LBL.SF_HUMI_LOW(shortLabel)] = parseInt(result[1]);
                        dayForecast[LBL.SF_HUMI_HIGH(shortLabel)] = parseInt(result[2]);  
                    }
                    severalDays.push(dayForecast);
                }
            }
            severalDays[LBL.RESULT_READY(shortLabel)] = true;
        } catch(e) {
            console.log(e);
            severalDays[LBL.RESULT_READY(shortLabel)] = false;
        }
    
        json[LBL.SF_ROOT(shortLabel)] = severalDays;
    
    }
    