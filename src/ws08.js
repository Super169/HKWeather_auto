module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');


// http://pda.weather.gov.hk/locspc/android_data/flw_wxicons_c.xml
// Sample:
//   50#0#中國東南部普遍天晴。###本港地區下午及今晚天氣預測#天晴，初時部分地區有煙霞。吹和緩東至東北風。#展望:未來兩三日天晴，除夕及元旦假期較涼。#2017年12月29日14時45分更新
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