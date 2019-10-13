module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');


// http://pda.weather.gov.hk/locspc/android_data/7days_gs_c.xml
// Return in JSON object
function handler(parms, json, result) {
    
    var shortLabel = parms.shortLabel;
    if (result.error) return;
    var html = result.body;
    if (html == null) return;

    var info = [];
    try {
        // console.log(html);
        var data = html.split("@");
        if (data.length == 8) {
            var idx;
            for (idx = 0; idx < 7; idx++) {
                var forecast = {};
                var dayInfo = data[idx].split("#");
                forecast[LBL.P7_DAY(shortLabel)] = dayInfo[0];
                forecast[LBL.P7_TEMP_LOW(shortLabel)] = dayInfo[1];
                forecast[LBL.P7_TEMP_HIGH(shortLabel)] = dayInfo[2];
                forecast[LBL.P7_HUMI_LOW(shortLabel)] = dayInfo[3];
                forecast[LBL.P7_HUMI_HIGH(shortLabel)] = dayInfo[4];
                forecast[LBL.P7_PIC(shortLabel)] = dayInfo[5];
                forecast[LBL.P7_WIND(shortLabel)] = dayInfo[6];
                forecast[LBL.P7_WEATHER(shortLabel)] = dayInfo[7];
                forecast[LBL.P7_WEEKDAY(shortLabel)] = dayInfo[dayInfo.length-1];
                info.push(forecast);
            }
            info[LBL.RESULT_READY(shortLabel)] = false;
        } else {
            info[LBL.RESULT_READY(shortLabel)] = false;
        }
    } catch(e) {
        console.log(e);
        info[LBL.RESULT_READY(shortLabel)] = false;
    }

    json[LBL.P7_ROOT(shortLabel)] = info;
}