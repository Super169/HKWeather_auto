module.exports.getYMD = getYMD;
module.exports.getYMDHMS = getYMDHMS;
module.exports.getHMS = getHMS;
module.exports.getYMDHMSMS = getYMDHMSMS;
module.exports.simplifyHtml = simplifyHtml;
module.exports.setWeatherResult = setWeatherResult;
module.exports.getRequestParm = getRequestParm;
module.exports.sendResponse = sendResponse;
module.exports.goProcessResults = goProcessResults;
module.exports.modifyUrl = modifyUrl;

const fs = require('fs');
const iconv = require('iconv-lite');
const LBL = require('./JsonLabel.js');
const wsSimple = require('./wsSimple');
const wsWifiClock = require('./wsWifiClock');

const district = [
    { idx:0, code: "HKO", eng:"Hong Kong Observatory", chi:"天文台", rpos:3, rname:"HK Observatory"},
    { idx:1, code: "KP", eng:"King's Park", chi:"京士柏", rpos:7, rname:"King's Park"},
    { idx:2, code: "HKS", eng:"Wong Chuk Hang", chi:"黃竹坑", rpos:34, rname:"Wong Chuk Hang"},
//                { idx:3, code: "TKL", eng:"Ta Kwu Ling", chi:"打鼓嶺", rpos:21, rname:"Ta Kwu Ling"},
    { idx:3, code: "TKL", eng:"Ta Kwu Ling", chi:"TaKwuLing", rpos:21, rname:"Ta Kwu Ling"},
    { idx:4, code: "LFS", eng:"Lau Fau Shan", chi:"流浮山", rpos:10, rname:"Lau Fau Shan"},
    { idx:5, code: "TPO", eng:"Tai Po", chi:"大埔", rpos:24, rname:"Tai Po"},
    { idx:6, code: "SHA", eng:"Sha Tin", chi:"沙田", rpos:15, rname:"Sha Tin"},
    { idx:7, code: "TUN", eng:"Tuen Mun", chi:"屯門", rpos:31, rname:"Tuen Mun"},
    { idx:8, code: "JKB", eng:"Tseung Kwan O", chi:"將軍澳", rpos:27, rname:"Tseung Kwan O"},
    { idx:9, code: "SKG", eng:"Sai Kung", chi:"西貢", rpos:14, rname:"Sai Kung"},
    { idx:10, code: "CCH", eng:"Cheung Chau", chi:"長洲", rpos:1, rname:"Cheung Chau"},
//                { idx:11, code: "HKA", eng:"Chek Lap Kok", chi:"赤鱲角", rpos:0, rname:"Chek Lap Kok"},
    { idx:11, code: "HKA", eng:"Chek Lap Kok", chi:"赤lap角", rpos:0, rname:"Chek Lap Kok"},
//                { idx:12, code: "TY1", eng:"Tsing Yi", chi:"青衣", rpos:28, rname:"Tsing Yi"},
    { idx:12, code: "TY1", eng:"Tsing Yi", chi:"TsingYi", rpos:28, rname:"Tsing Yi"},
//                { idx:13, code: "SEK", eng:"Shek Kong", chi:"石崗", rpos:18, rname:"Shek Kong"},
    { idx:13, code: "SEK", eng:"Shek Kong", chi:"ShekKong", rpos:18, rname:"Shek Kong"},
    { idx:14, code: "TWHK", eng:"Tsuen Wan Ho Koon", chi:"荃灣可觀", rpos:29, rname:"Tsuen Wan Ho Koon"},
    { idx:15, code: "TWSMV", eng:"Tsuen Wan Shing Mun Valley", chi:"荃灣城門谷", rpos:30, rname:"Tsuen Wan Shing Mun Valley"},
    { idx:16, code: "HKP", eng:"Hong Kong Park", chi:"香港公園", rpos:4, rname:"HK Park"},
//                { idx:17, code: "SKW", eng:"Shau Kei Wan", chi:"筲箕灣", rpos:17, rname:"Shau Kei Wan"},
    { idx:17, code: "SKW", eng:"Shau Kei Wan", chi:"shau箕灣", rpos:17, rname:"Shau Kei Wan"},
    { idx:18, code: "KC", eng:"Kowloon City", chi:"九龍城", rpos:8, rname:"Kowloon City"},
    { idx:19, code: "HV", eng:"Happy Valley", chi:"跑馬地", rpos:2, rname:"Happy Valley"},
    { idx:20, code: "WTS", eng:"Wong Tai Sin", chi:"黃大仙", rpos:35, rname:"Wong Tai Sin"},
    { idx:21, code: "S", eng:"Stanley", chi:"赤柱", rpos:20, rname:"Stanley"},
//                { idx:22, code: "KT", eng:"Kwun Tong", chi:"觀塘", rpos:9, rname:"Kwun Tong"},
    { idx:22, code: "KT", eng:"Kwun Tong", chi:"KwunTong", rpos:9, rname:"Kwun Tong"},
//                { idx:23, code: "SSP", eng:"Sham Shui Po", chi:"深水埗", rpos:16, rname:"Sham Shui Po"},
    { idx:23, code: "SSP", eng:"Sham Shui Po", chi:"深水po", rpos:16, rname:"Sham Shui Po"},
    { idx:24, code: "KTRP", eng:"Kai Tak Runway Park", chi:"啟德跑道公園", rpos:5, rname:"Kai Tak Runway Park"},
    { idx:25, code: "YLP", eng:"Yuen Long Park", chi:"元朗公園", rpos:36, rname:"Yuen Long Park"},
    { idx:26, code: "TMT", eng:"Tai Mei Tuk", chi:"大美督", rpos:22, rname:"Tai Mei Tuk"},
    { idx:-1, code: "PEN", eng:"Peng Chau", chi:"坪洲", rpos:13, rname:"Peng Chau"},
    { idx:-1, code: "WGL", eng:"Waglan Island", chi:"", rpos:32, rname:"Waglan Island"},
    { idx:-1, code: "SSH", eng:"Sheung Shui", chi:"上水", rpos:19, rname:"Sheung Shui"}
];

function getYMD() {
    return getYMDHMSMS().substr(0,8);
}

function getYMDHMS() {
    return getYMDHMSMS().substr(0,14);
}

function getHMS() {
    return getYMDHMSMS().substr(8,6);
}

function getYMDHMSMS() {
    var now = new Date();
    var strDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
    strDate=strDate.substr(0,23).replace(new RegExp("[-|T|:|.]",'g'),"");
    return strDate;
}

function simplifyHtml(html) {
    // a little bit stupid, need to improve here
    // Steps:
    //   1) remove all tab if any
    //   2) replace \r \n as " "
    //   3) replace all multiple space as " "
    html=html.replace(new RegExp("[\t]", 'g'), "");
    html=html.replace(new RegExp("[\r\n]", 'g'), " ");
    html=html.replace(new RegExp(" [ ]+", 'g'), " ");
    return html;   
}

function setWeatherResult(json, label, cdata, regEx) {
    var result = cdata.match(regEx);
    if ((result!=null) && (result.length>1)) {
        json[label] = result[1];    
    }
}

function getParmInt(parms, parmName, defValue) {
    if (!parms.hasOwnProperty(parmName)) return defValue;
    var data = parseInt(parms[parmName]);
    if (data > 0) return data;
    return defValue;
}

function getRequestParm(req) {
    var parms = req.query;
    var json = {};
    json["debug"] = ((parms.debug == "ON") || (parms.debug == "on"));
    json["dumpdata"] = ((parms.dumpdata == "YES") || (parms.dumpdata == "yes"));
    json["mode"] = (parms.hasOwnProperty("mode") ? parseInt(parms.mode) : 0);
    json["shortLabel"] = ((json["mode"] == 1) || (json["mode"] == 2) || (json["mode"] == 3));
    
//    http://super169.asuscomm.com:20269/wfc?STEP=1&MINSTEP=3&DAY_BARSIZE=25&DAY_BASESIZE=20&HOUR_BARSIZE=40&HOUR_BASESIZE=40&location=

    json['STEP'] = getParmInt(parms, "STEP", 1);
    json['minSTEP'] = getParmInt(parms, "MINSTEP", 3);
    json['DAY_BARSIZE'] = getParmInt(parms, "DAY_BARSIZE", 40);
    json['DAY_BASESIZE'] = getParmInt(parms, "DAY_BASESIZE", 20);
    json['HOUR_BARSIZE'] = getParmInt(parms, "HOUR_BARSIZE", 50);
    json['HOUR_BASESIZE'] = getParmInt(parms, "HOUR_BASESIZE", 40);
    

    var loc = "";
    var currDist = "SHA";
    var currDistIdx = -1;
    if (parms.hasOwnProperty("location")) {
        loc = parms.location.toString().toUpperCase();
    }
   
    try {
        if (loc == "") {
            currDistIdx = 0;
        } else {
            var idx;
            currDist = loc;
            for (idx=0; idx < district.length; idx++) {
                if (district[idx].code == currDist) {
                    currDistIdx = idx;
                    break;
                }
            }
            if (currDistIdx < 0) {
                currDistIdx = 0;
            }
        }
    } catch(e) {
        currDistIdx = 0;
        console.log(e);
    }

    json[LBL.PARM_DISTRICT_IDX] = currDistIdx;
    json[LBL.PARM_DISTRICT_CODE] = district[currDistIdx].code;
    json[LBL.PARM_DISTRICT_ENG ] = district[currDistIdx].eng;
    json[LBL.PARM_DISTRICT_CHI] = district[currDistIdx].chi;
    json[LBL.PARM_DISTRICT_RNAME] = district[currDistIdx].rname;
    return json;
}

function sendResponse(response, data) {
    var big5data = iconv.encode(data, 'big5');
    //var big5data = iconv.convert(data);
    response.writeHead(200, { "content-Type": "text/plain" });
    response.write(big5data);
    response.end();
}


function goProcessResults(requestSource, parms, results, response) {
    var shortLabel = parms.shortLabel;

    var json = {};
    json[LBL.RT_DISTRICT_CODE(shortLabel)] = parms[LBL.PARM_DISTRICT_CODE];
    json[LBL.RT_DISTRICT_ENG(shortLabel)] = parms[LBL.PARM_DISTRICT_ENG];
    json[LBL.RT_DISTRICT_ENG(shortLabel)] = parms[LBL.PARM_DISTRICT_CHI];

    try {
        var errCnt = 0;
        // Process in the order as requestInfo
        for (i in requestSource) {
            for (j in results) {
                var url = modifyUrl(requestSource[i].url, parms);
                // if (results[j].res.request.href == url) {
                if (matchUrl(results[j].res.request.href, url)) {
                    if (results[j].error) {
                        errCnt++;
                    } else {
                        if (parms.dumpdata) {
                            var dumpFileName = "dataDump\\" + getYMDHMSMS() + "." + requestSource[i].dumpfile;
                            fs.writeFile(dumpFileName, results[j].body, function (err) {
                                if (err) console.log(err);
                                console.log("Write to " + dumpFileName);
                            } );
                        }
                    }
                    // go handler even error, let the handler decide if it should proceed.
                    requestSource[i].handler(parms, json, results[j]);
                    break;                    
                }
            }
        }
    } catch(e) {
        console.log(e);
    }
    
    switch (parms.mode) {
        case 2:
            wsSimple.sendSimplyResult(parms, response, json);
            break;
        case 100:
            wsWifiClock.sendWifiClockResult(parms, response, json);
            break;
        default:
            sendResponse(response, JSON.stringify(json));
            break;
    }
}

function modifyUrl(url, parms) {
    if (url.indexOf("$location$") > -1) {
        url=url.replace(new RegExp("[$]location[$]", 'g'), parms.districtCode);
    }
    if (url.indexOf("$time$") > -1) {
        var ms = (new Date).getTime();
        url=url.replace(new RegExp("[$]time[$]", 'g'), ms);
    }
    
    return url;
}

function matchUrl(url1, url2) {
    if (url1 == url2) return true;
    if (url1.indexOf('?') > -1) {
        var sp = url1.split('?');
        url1 = sp[0];
    }
    if (url2.indexOf('?') > -1) {
        var sp = url2.split('?');
        url2 = sp[0];
    }
    if (url1 == url2) return true;
    // Remove http:// & https:// if any, and compare again
    url1 = url1.replace("http://","").replace("https://","");
    url2 = url2.replace("http://","").replace("https://","");
    return (url1 == url2);
    
}