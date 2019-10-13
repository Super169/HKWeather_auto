module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');

// http://pda.weather.gov.hk/locspc/android_data/fnd_uc.xml
// Return in JSON object
function handler(parms, json, result) {
    
    var shortLabel = parms.shortLabel;
    if (result.error) return;
    var html = result.body;
    if (html == null) return;

    var info = {};
    try {
        console.log(html);
    } catch(e) {
        console.log(e);
        info[LBL.RESULT_READY(shortLabel)] = false;
    }

    json[LBL.PF_ROOT(shortLabel)] = info;
}