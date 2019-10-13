module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');


// http://www.weather.gov.hk/wxinfo/json/one_json.xml?_=$time$
function handler(parms, json, result) {
    
    var shortLabel = parms.shortLabel;
    if (result.error) return;
    var html = result.body;
    if (html == null) return;

    var info = {};

    var milliseconds = (new Date).getTime();
    try {
        info = JSON.parse(html);


    } catch(e) {
        console.log(e);
        info[LBL.RESULT_READY(shortLabel)] = false;
    }

    json[LBL.OJ_ROOT(shortLabel)] = info;
}