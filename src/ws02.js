module.exports.handler = handler;

const LBL = require('./JsonLabel.js');


// http://www.weather.gov.hk/wxinfo/ts/text_readings_e.htm
function handler(parms, json, result) {
    //    json["text_readings_e"] = {"url":"http://www.weather.gov.hk/wxinfo/ts/text_readings_e.htm", "status" : "Not ready"};
    
        var shortLabel = parms.shortLabel;
        if (result.error) return;
        var html = result.body;
        if (html == null) return;
        var regionalWeather = {};
    
        try {
            var regex, reulst;
    
            regex = parms[LBL.PARM_DISTRICT_RNAME] + "[ ]*([0-9]+([.][0-9]*){0,1})[ ]*([0-9]+([.][0-9]*){0,1})";
            result = html.match(regex);
            if ((result!=null) && (result.length > 1)) {
                regionalWeather[LBL.RW_TEMP(shortLabel)] = result[1];
                if (result.length > 3) {
                    regionalWeather[LBL.RW_HUMI(shortLabel)] = result[3];
                }
            }
            regionalWeather[LBL.RESULT_READY(shortLabel)] = true;
        } catch(e) {
            console.log(e);
            regionalWeather[LBL.RESULT_READY(shortLabel)] = false;
        }
        json[LBL.RW_ROOT(shortLabel)] = regionalWeather;
    }
    