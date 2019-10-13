module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');


// http://maps.weather.gov.hk/ocf/text_e.html?mode=0&station=$location$#
function handler(parms, json, result) {
    
    var shortLabel = parms.shortLabel;
    if (result.error) return;
    var html = result.body;
    if (html == null) return;

    var info = {};
    try {
        var forecast = JSON.parse(html);

        if (parms.mode == 0) {
            json[LBL.DF_ROOT(shortLabel)] = forecast;
            return;
        }

        if (forecast.hasOwnProperty("DailyForecast")) {
            var df = forecast["DailyForecast"];
            info[LBL.DF_DAY_0(shortLabel)] = df[0]["ForecastDate"];
            for (idx = 0; idx < df.length; idx++) {
                info[LBL.DF_DAY_PIC(shortLabel) + idx] = df[idx]["ForecastDailyWeather"];
                info[LBL.DF_DAY_TEMP_LOW(shortLabel) + idx] = df[idx]["ForecastMinimumTemperature"];
                info[LBL.DF_DAY_TEMP_HIGH(shortLabel) + idx] = df[idx]["ForecastMaximumTemperature"];
                info[LBL.DF_DAY_RAIN(shortLabel) + idx] = df[idx]["ForecastChanceOfRain"];
            }
        }


        if (forecast.hasOwnProperty("HourlyWeatherForecast")) {
            var hf = forecast["HourlyWeatherForecast"];
            // 36 is already more than enough
            for (idx = 0; idx < 36; idx++) {
                info[LBL.DF_HOUR_TIME(shortLabel) + idx] = hf[idx]["ForecastHour"];
                info[LBL.DF_HOUR_PIC(shortLabel) + idx] = hf[idx]["ForecastWeather"];
                info[LBL.DF_HOUR_TEMP(shortLabel) + idx] = hf[idx]["ForecastTemperature"];
                info[LBL.DF_HOUR_HUMI(shortLabel) + idx] = hf[idx]["ForecastRelativeHumidity"];
            }
        }
        info[LBL.RESULT_READY(shortLabel)] = true;
    } catch(e) {
        console.log(e);
        info[LBL.RESULT_READY(shortLabel)] = false;
    }

    json[LBL.DF_ROOT(shortLabel)] = info;
}