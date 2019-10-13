module.exports.sendSimplyResult = sendSimplyResult;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');

/*
    SIM_DISTRICT_CODE:          RT_DISTRICT_CODE (char*)
    SIM_PICTURE_ICON:           CW_ROOT.CW_PICTURE_ICON (int)
    SIM_TEMP:                   RW_ROOT.RW_TEMP str(float)
    SIM_HUMI:                   RW_ROOT.RW_HUMI str(int)
    SIM_RAINSTORM:              WS_ROOT.WS_RAINSTORM (int))
    SIM_TYPHOON:                WS_ROOT.WS_TYPHOON (int)

    SIM_PIC + idx:              DF_ROOT.DF_PIC + idx (int)
    SIM_DAY_TEMP_LOW + idx      DF_ROOT.TEMP_LOW + idx (int)
    SIM_DAY_TEMP_HIGH + idx     DF_ROOT.TEMP_HIGH + idx (int)
    SIM_DAY_RAIN + idx          DF_ROOT.RAI + idx (char *)

    SIM_HOUR_0                  LBL.DF_HOUR_0(shortLabel) (int)
    SIM_HOUR_PIC                LBL.DF_HOUR_PIC(shortLabel) + idx (int)
    SIM_HOUR_TEMP               LBL.DF_HOUR_TEMP(shortLabel) + idx  float
    SIM_HOUR_HUMI               LBL.DF_HOUR_HUMI(shortLabel) + idx  float
*/

function sendSimplyResult(parms, response, fullJson){

    var shortLabel = parms.shortLabel;
    var json = {};
    json[LBL.RESULT_READY(shortLabel)] = true;
    try {
        json[LBL.SIM_DISTRICT_CODE(shortLabel)] = fullJson[LBL.RT_DISTRICT_CODE(shortLabel)];

        var cw = fullJson[LBL.CW_ROOT(shortLabel)];
        json[LBL.SIM_PICTURE_ICON(shortLabel)] = parseInt(cw[LBL.CW_PICTURE_ICON(shortLabel)]);

        var rw = fullJson[LBL.RW_ROOT(shortLabel)];
        json[LBL.SIM_TEMP(shortLabel)] = rw[LBL.RW_TEMP(shortLabel)];
        json[LBL.SIM_HUMI(shortLabel)] = rw[LBL.RW_HUMI(shortLabel)];

        var ws = fullJson[LBL.WS_ROOT(shortLabel)];
        if (ws[LBL.WS_RAINSTORM(shortLabel)] == null) {
            json[LBL.SIM_RAINSTORM(shortLabel)] = -1;
        } else {
            json[LBL.SIM_RAINSTORM(shortLabel)] = parseInt(ws[LBL.WS_RAINSTORM(shortLabel)]);
        }

        if (ws[LBL.WS_TYPHOON(shortLabel)] == null) {
            json[LBL.SIM_TYPHOON(shortLabel)] = -1;
        } else {
            json[LBL.SIM_TYPHOON(shortLabel)] = parseInt(ws[LBL.WS_TYPHOON(shortLabel)]);
        }

        var df = fullJson[LBL.DF_ROOT(shortLabel)];
        for (var idx=0; idx < 3; idx++) {
            json[LBL.SIM_DAY_PIC(shortLabel) + idx] = parseInt(df[LBL.DF_DAY_PIC(shortLabel) + idx]);
            json[LBL.SIM_DAY_TEMP_LOW(shortLabel) + idx] = parseInt(df[LBL.DF_DAY_TEMP_LOW(shortLabel) + idx]);
            json[LBL.SIM_DAY_TEMP_HIGH(shortLabel) + idx] = parseInt(df[LBL.DF_DAY_TEMP_HIGH(shortLabel) + idx]);
            json[LBL.SIM_DAY_RAIN(shortLabel) + idx] = parseInt(df[LBL.DF_DAY_RAIN(shortLabel) + idx]);
        }

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

        // TODO: error handling if not found - what can i do?
        json[LBL.SIM_HOUR_NOW(shortLabel)] = currHrCode;
        json[LBL.SIM_HOUR_0(shortLabel)] = parseInt(df[LBL.DF_HOUR_TIME(shortLabel) + hr0idx]);
        for (var idx=0; idx < 12; idx++) {
            var dfIdx = hr0idx + idx;
            if (df[LBL.DF_HOUR_PIC(shortLabel) + dfIdx] == null) {
                json[LBL.SIM_HOUR_PIC(shortLabel) + idx] = 0;
            } else {
                json[LBL.SIM_HOUR_PIC(shortLabel) + idx] = parseInt(df[LBL.DF_HOUR_PIC(shortLabel) + dfIdx]);
            }
            json[LBL.SIM_HOUR_TEMP(shortLabel) + idx] = parseFloat(df[LBL.DF_HOUR_TEMP(shortLabel) + dfIdx]);
            json[LBL.SIM_HOUR_HUMI(shortLabel) + idx] = parseFloat(df[LBL.DF_HOUR_HUMI(shortLabel) + dfIdx]);
        }
 
    } catch (e) {
        console.log(e);
        json[LBL.RESULT_READY(shortLabel)] = false;
    }
    UTIL.sendResponse(response, JSON.stringify(json));
}


