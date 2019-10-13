module.exports.handler = handler;

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');

// http://rss.weather.gov.hk/rss/CurrentWeather.xml
function handler(parms, json, result) {
//    json["CurrentWeather"] = {"url":"http://rss.weather.gov.hk/rss/CurrentWeather.xml", "status" : "Not ready"};

    var shortLabel = parms.shortLabel;
    if (result.error) return;
    var html = result.body;
    if (html == null) return;
    var currWeather = {};

    try {
        var cdata, regex, reulst;

        html = UTIL.simplifyHtml(html);

        // for faster search on CDATA only if possible
        regex = "<![\[]CDATA[\[](.*)]]>";
        result = html.match(regex);
        if ((result!=null) && (result.length>1)) cdata = result[1];
        else cdata = html;
        UTIL.setWeatherResult(currWeather, LBL.CW_PICTURE_ICON(shortLabel), cdata, " src=\"http://rss.weather.gov.hk/img/pic([0-9]+)[.]png\" ");
        UTIL.setWeatherResult(currWeather, LBL.CW_HK_TEMP(shortLabel), cdata, "<br/>[ ]*?Air temperature : ([0-9]+) degrees Celsius<br/>");
        UTIL.setWeatherResult(currWeather, LBL.CW_HK_HUMI(shortLabel), cdata, "<br/>[ ]*?Relative Humidity : ([0-9]+([\.][0-9]+)?) per cent<br/>");
        UTIL.setWeatherResult(currWeather, LBL.CW_UV_INDEX(shortLabel), cdata, "<br/>[ ]*?During the past hour the mean UV Index recorded at King\'s Park : ([0-9]+([\.][0-9]+)?)<br/>");
        UTIL.setWeatherResult(currWeather, LBL.CW_UV_INTENSITY(shortLabel), cdata, "<br/>[ ]*?Intensity of UV radiation : ([^<]*)<br/>");

        var currDistIdx = parms.districtIdx;
        var distTable = cdata.match(/<tr>.*?<\/tr>/g);
        if (distTable.length > 0)  {
            if (currDistIdx >= distTable.length)  currDistIdx = 0;
            var distData = distTable[currDistIdx];
            regex = "<td><font size=\"-1\">(.*?)</font></td><td width=\"100\" align=\"right\"><font size=\"-1\">([0-9]+([\.][0-9]+)?) degrees [\.;]</font></td>";
            result = distData.match(regex);
            if ((result!=null) && (result.length>2)) {
                currWeather[LBL.CW_LOCAL_TEMP(shortLabel)] = result[2];
            }
        }

        currWeather[LBL.RESULT_READY(shortLabel)] = true;
    } 
    catch (e) {
        console.error(e);
        currWeather[LBL.RESULT_READY(shortLabel)] = false;
    }
    json[LBL.CW_ROOT(shortLabel)] = currWeather;
    
}

