module.exports.sendWifiClockResult = sendWiFiClockResult;

const version = "2.1";
const delimiter = "||";
const emptyData = "NaN" + delimiter;
const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');
const sWeekDay = ["日","一","二","三","四","五","六"];

function newData(data, defaultValue) {
    if (defaultValue == undefined) defaultValue = "";
    var retVal = ( (((data == null) || (data == undefined)) ? defaultValue : data) + delimiter );
    if (retVal == emptyData) retVal = delimiter;
    return retVal;
}

function sendWiFiClockResult(parms, response, fullJson){ 
    var shortLabel = parms.shortLabel;
    var s = "";
    s += newData(version)
    try {

        var cw = fullJson[LBL.CW_ROOT(shortLabel)];
        var rw = fullJson[LBL.RW_ROOT(shortLabel)];
        var ws = fullJson[LBL.WS_ROOT(shortLabel)];
        var df = fullJson[LBL.DF_ROOT(shortLabel)];
        var oj = fullJson[LBL.OJ_ROOT(shortLabel)];
        var p7 = fullJson[LBL.P7_ROOT(shortLabel)];

        // 01 - district code
        s += newData(fullJson[LBL.RT_DISTRICT_CODE(shortLabel)]);
        
        // 02 - Current Icon
        s += newData(cw[LBL.CW_PICTURE_ICON(shortLabel)]);

        // 03 - Raninstore signal
        // 04 - Typhoon signal
        s += newData(ws[LBL.WS_RAINSTORM(shortLabel)]);
        s += newData(ws[LBL.WS_TYPHOON(shortLabel)]);
        

        // 05 - local temperature
        // 06 - local humidity
        s += newData(rw[LBL.RW_TEMP(shortLabel)]);
        s += newData(rw[LBL.RW_HUMI(shortLabel)]);


        var sDate = df[LBL.DF_DAY_0(shortLabel)];
        var pDate = parseInt(p7[0][LBL.P7_DAY(shortLabel)]);
        var iDate = (new Date(sDate.substr(0,4) +"-"+ sDate.substr(4,2)+"-"+ sDate.substr(6,2))).getDay();
        
        var cIdx = findDateAdj(pDate);

        s += newData(sDate);
        s += newData(iDate);

        var pic = {};
        var dtl = {};
        var dth = {};
        var dtMin = 999;
        var dtMax = -999;
        var dbl = {};
        var dbh = {};


        var STEP = parms.STEP;
        var minSTEP = parms.minSTEP;
        var DAY_BARSIZE = parms.DAY_BARSIZE;
        var DAY_BASESIZE = parms.DAY_BASESIZE;
        var HOUR_BARSIZE = parms.HOUR_BARSIZE;
        var HOUR_BASESIZE = parms.HOUR_BASESIZE;

        if (parms.hasOwnProperty('STEP')) STEP = parms.STEP;

        var barMin, barMax, barRange, eBot, minRange;

        for (var idx=0; idx < 8; idx++) {
            dtl[idx] = parseFloat(df[LBL.DF_DAY_TEMP_LOW(shortLabel) + idx]);
            dth[idx] = parseFloat(df[LBL.DF_DAY_TEMP_HIGH(shortLabel) + idx]);
            if (dtl[idx] < dtMin) dtMin = dtl[idx];
            if (dth[idx] > dtMax) dtMax = dth[idx];
        }

        var dtBar = setBar(dtMin, dtMax, STEP, minSTEP, DAY_BARSIZE);

        for (var idx=0; idx < 8; idx++) {
            var xPos = idx - cIdx;
            var pic;
            if ((xPos >= 0) && (xPos < 7)) {
                pic =  p7[xPos][LBL.P7_PIC(shortLabel)];
            } else {
                pic =  df[LBL.DF_DAY_PIC(shortLabel) + idx];
                if ((pic == "9999") || (pic == "")) {
                    if (idx == 0) pic = cw[LBL.CW_PICTURE_ICON(shortLabel)];
                }
            }
            // s += newData(parseInt(df[LBL.DF_DAY_PIC(shortLabel) + idx]));
            s += newData(pic);
            s += newData(dtl[idx]);
            s += newData(dth[idx]);
            s += newData(df[LBL.DF_DAY_RAIN(shortLabel) + idx]);
            var barLow = Math.floor((dtl[idx] - dtBar.barMin) * dtBar.ratio) + DAY_BASESIZE;
            var barHigh = Math.floor((dth[idx] - dtBar.barMin) * dtBar.ratio) + DAY_BASESIZE;
            s += newData(barLow);
            s += newData(barHigh);
        }
        s += newData(dtBar.barMin);
        s += newData(dtBar.barMax);


        var hr0 = parseInt(df[LBL.DF_HOUR_TIME(shortLabel)+'0']) % 100;
        var now = new Date();

        // Set to hong kong time GMT +8
        var timezone = new Date().getTimezoneOffset();
        var minAdj = 480 + timezone;
        now.setMinutes(now.getMinutes() + minAdj);

        var hr0code = parseInt(df[LBL.DF_HOUR_TIME(shortLabel)+'0']);
        var currHrCode = now.getFullYear()*1000000 + (now.getMonth() + 1) * 10000 + (now.getDate()) * 100 + now.getHours();
        
        var hr0idx =  -1;
        var hrCode;
        for (var idx=0; idx < 23; idx++) {
            hrCode = parseInt(df[LBL.DF_HOUR_TIME(shortLabel) + idx]);
            if (hrCode == currHrCode) {
                hr0idx = idx;
                break;
            }
        }

        var hr0 = parseInt(df[LBL.DF_HOUR_TIME(shortLabel) + hr0idx]);
        s += newData(df[LBL.DF_HOUR_TIME(shortLabel) + hr0idx]);

        var hpic = {};
        var ht = {};
        var hh = {};
        var htMin = 999;
        var htMax = -999;

        for (var idx=0; idx < 12; idx++) {
            var dfIdx = hr0idx + idx;
            hpic[idx] = parseInt(df[LBL.DF_HOUR_PIC(shortLabel) + dfIdx]);
            ht[idx] = parseFloat(df[LBL.DF_HOUR_TEMP(shortLabel) + dfIdx]);
            hh[idx] = parseFloat(df[LBL.DF_HOUR_HUMI(shortLabel) + dfIdx]);

            if (ht[idx] < htMin) htMin = ht[idx];
            if (ht[idx] > htMax) htMax = ht[idx];
        }


        var htBar = setBar(htMin, htMax, STEP, minSTEP, HOUR_BARSIZE);

        for (var idx=0; idx < 12; idx++) {
            s += newData(hpic[idx], "0");
            s += newData(ht[idx]);
            s += newData(hh[idx]);
            var bar = Math.floor((ht[idx] - htBar.barMin) * htBar.ratio) + HOUR_BASESIZE;
            s += newData(bar);
        }
        s += newData(htBar.barMin);
        s += newData(htBar.barMax);


        var hrBase = (hr0 % 100)
        var hrShift = (hrBase % 3);
        if (hrShift != 0) hrShift = 3 - hrShift;
        hrBase = (hrBase + hrShift) % 24;

        s += newData(hrShift);
        for (var idx=0; idx < 4; idx++) {
            var sHour = (hrBase < 10 ? "0" : "") + hrBase + ":00";
            s += newData(sHour);
            hrBase = (hrBase + 3) % 24;
        }

        var buDate = oj["FLW"]["BulletinDate"];
        buDate = buDate.substring(0,4) + "年" + buDate.substring(4,6) + "月" + buDate.substr(6,8) + "日";
        var f9dwf = oj["F9D"]["WeatherForecast"];
        var day0 = f9dwf[0]["ForecastDate"];
        var adjIdx = findDateAdj(day0);
        // adjIdx should either 0 or 1
        var wd0 = parseInt(f9dwf[0]["WeekDay"]) - adjIdx;
        if (wd0 < 0) wd0 += 7;
        buDate += "(" + sWeekDay[wd0] + ")";
        s += newData(buDate);
        var dayForecast = oj["FLW"]["ForecastDesc"];
        var dayOutlook = oj["FLW"]["OutlookContent"]
        // var finalArr = final.split('。');
        // s += newData(finalArr[0]+'。');
        var final = dayForecast.replace(new RegExp("[<].+?[>]", 'g'), "") + "  " + dayOutlook.replace(new RegExp("[<].+?[>]", 'g'), "");
        s += newData(final);

        for (var i = 1; i < 8; i++) {
            var fDate = f9dwf[i-adjIdx]["ForecastDate"];
            var wDate = parseInt(f9dwf[i-adjIdx]["WeekDay"]);
            fDate = fDate.substring(4,6) + "-" + fDate.substr(6,8) +"(" + sWeekDay[wDate] + ")";
            s += newData(fDate);
            s += newData(f9dwf[i-adjIdx]["ForecastWeather"]);
        }
		
		s += newData(Math.round((new Date).getTime() / 1000, 0));

        s = "0" + delimiter + s;
    } catch (e) {
        console.log(e);
        s = "1" + delimiter + s;
    }
    UTIL.sendResponse(response, s);  
}

function findDateAdj(day0) {
    var currDate = getLocalTime();
    var adjIdx;
    for (adjIdx = 0; adjIdx < 8; adjIdx++) {
        var cDate = currDate.getFullYear()*10000 + (currDate.getMonth() + 1) * 100 + (currDate.getDate());
        if (day0 == cDate) break;
        currDate.setDate(currDate.getDate()+1);
    }        
    // If it is greater than 7, nothing can do, may add some error handling later
    return adjIdx;
}

function setBar(dataMin, dataMax, STEP, minSTEP, BARSIZE) {
    var bar = {};
    var barMin, barMax, barRange, eBot, minRange;

    barMin = Math.floor((dataMin - 0.1) / STEP) * STEP;
    barMax = Math.ceil((dataMax + 0.1) / STEP) * STEP;
    barRange = barMax - barMin;
    eBot = true;
    minRange = STEP * minSTEP;
    while (barRange < minRange) {
        if (eBot) barMin -= STEP;
        else barMax += STEP;
        eBot = !eBot;
        barRange += STEP;
    }
    
    // get again for safety
    barRange = barMax - barMin;
    var ratio = BARSIZE / barRange;
    
    bar.barMin = barMin;
    bar.barMax = barMax;
    bar.ratio = ratio;
    return bar;
}

function getLocalTime() {
    var now = new Date();

    // Set to hong kong time GMT +8
    var timezone = new Date().getTimezoneOffset();
    var minAdj = 480 + timezone;
    now.setMinutes(now.getMinutes() + minAdj);
    return now;
}