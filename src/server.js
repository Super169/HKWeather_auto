var appName = "HKWeather169 v0.1.0";

const Regex = require('regex');
// const http = require('http');
const express = require('express');
const fs = require('fs');

const request = require('request');

const iconv = require('iconv-lite');

const LBL = require('./JsonLabel');
const UTIL = require('./myUtil');

const ws01 = require('./ws01');
const ws02 = require('./ws02');
const ws03 = require('./ws03');
const ws04 = require('./ws04');
const ws05 = require('./ws05');
const ws06 = require('./ws06');
const ws07 = require('./ws07');
const ws08 = require('./ws08');
const ws09 = require('./ws09');
const ws10 = require('./ws10');

var proxyEnabled = false;
var proxyHost = "";
var proxyPort = 8080;
var proxyAuth = "";

function getHttpOptions(url) {
    if (!proxyEnabled) return url;
    var httpOptions =  {
                            host: proxyHost,
                            port: proxyPort,
                            path: url,
                            headers: {
                                "Proxy-Authorization" : proxyAuth,
                                Host: url
                            }

                        };
    return httpOptions;
}

//  Read configure 
try {
    if (fs.existsSync('config.json')) {
        var configFile = fs.readFileSync('config.json', 'utf8');
        if (configFile != null) {
            var settings = JSON.parse(configFile);
            if (settings.hasOwnProperty("proxyEnabled")) proxyEnabled = settings.proxyEnabled;
            if (proxyEnabled) {
                if (settings.hasOwnProperty("proxyHost")) proxyHost = settings.proxyHost;
                if (settings.hasOwnProperty("proxyPort")) proxyPort = settings.proxyPort;
                if (settings.hasOwnProperty("proxyAuth")) proxyAuth = settings.proxyAuth;
    //                proxyAuth = 'Basic ' + new Buffer(settings.proxyAuth).toString('base64');
            }
        }
    }
} catch(e) {
    console.log(e);
    proxyEnabled = false;
}

var app = express();

app.get('/', function (req, res){
    res.writeHead(200, { "content-Type": "text/plain" });
    res.write('Non-System disk or disk error\n');
    res.write('Replace and press any key when ready\n');
    res.write('Your PC is now Stoned!\n');
    res.end();
});

app.get(['/h','/help'], function (req, res) {
    res.writeHead(200, { "content-Type": "text/plain" });
    res.write(appName + "\n\n");
    res.write("/i /info :     Display software information\n");
    res.write("/j :           Result in JSON format\n");
    res.write("               Parameter:\n");
    res.write("               mode=> 0 - long label full (default)\n");
    res.write("               mode=> 1 - short lable full \n");
    res.write("               mode=> 2 - short lable simple \n");
    res.write("/x :           Testing module\n");
    res.end();
});

app.get(['/i','/info'], function (req, res) {
    res.writeHead(200, { "content-Type": "text/plain" });
    res.write(appName);
    res.end();
});

app.get(['/wfc', '/wifiClock'], function(req, response) {
    var parms = UTIL.getRequestParm(req);
    parms.mode=100;
    parms.shortLabel=true;
    getWeather(mcu_DataSource, parms, response);
});

app.get(['/j','/json'], function (req, response) {
    var parms = UTIL.getRequestParm(req);
    switch (parms.mode) {
        case 0:
            getWeather(fullDataSource, parms, response);
            break;
        case 1:
            getWeather(m1_DataSource, parms, response);
            break;
        case 2:
            getWeather(m2_DataSource, parms, response);
            break;
        case 3:
            getWeather(m3_DataSource, parms, response);
            break;
        case 4:
            getWeather(m4_DataSource, parms, response);
            break;
        default:
            UTIL.sendResponse(response, "Iinvalid mode: " + parms.mode);
            break;
    }
});

app.get(['/x'], function (req, response) {
    var parms = UTIL.getRequestParm(req);
    var url = "http://maps.weather.gov.hk/ocf/dat/$location$.xml";
    if (url.indexOf("$location$") > -1) {
        url=url.replace(new RegExp("[$]location[$]", 'g'), parms.districtCode);
    }    
    request(getHttpOptions(url), function(error, res, body) {
        if (error) {
            UTIL.sendResponse(response, "Error");
        } else {
            UTIL.sendResponse(response, body);
        }
    });
});

app.get(['/y'], function (req, response) {
    var now = new Date();
    var timezone = new Date().getTimezoneOffset();
    var minAdj = 480 + timezone;
    var adjTime = new Date(now);
//    adjTime.setMinutes(now.getMinutes() + minAdj);
    adjTime.setMinutes(now.getMinutes() + timezone);
    var msg = "now: " + now.toString() + " => " + timezone + " : " + now.getHours();
    msg += "\nAdj: " + minAdj + " => " + adjTime.toString() + " : " + adjTime.getHours();
    UTIL.sendResponse(response, msg);
});

app.get(['/z'], function (req, response) {
    var parms = UTIL.getRequestParm(req);
    getWeather(z_DataSource, parms, response);
});

var port = process.env.prot || 8080;
    app.listen(port, function () {
    console.log('App listening on port ' + port);
});


// ---------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------

var Source01 = { "dumpfile" : "01", "url" :"http://rss.weather.gov.hk/rss/CurrentWeather.xml", "handler" : ws01.handler };
var Source02 = { "dumpfile" : "02", "url" :"http://www.weather.gov.hk/wxinfo/ts/text_readings_e.htm", "handler" : ws02.handler };
var Source03 = { "dumpfile" : "03", "url" :"http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml", "handler" : ws03.handler };
var Source04 = { "dumpfile" : "04", "url" :"http://www.weather.gov.hk/wxinfo/currwx/fnd.htm", "handler" : ws04.handler };
var Source05 = { "dumpfile" : "05", "url" :"http://rss.weather.gov.hk/rss/SeveralDaysWeatherForecast.xml", "handler" : ws05.handler };
var Source06 = { "dumpfile" : "06", "url" :"http://maps.weather.gov.hk/ocf/dat/$location$.xml", "handler" : ws06.handler };
var Source07 = { "dumpfile" : "07", "url" :"http://www.weather.gov.hk/wxinfo/json/one_json_uc.xml?_=$time$", "handler" : ws07.handler };
var Source08 = { "dumpfile" : "08", "url" :"http://pda.weather.gov.hk/locspc/android_data/flw_wxicons_c.xml", "handler" : ws08.handler };
var Source09 = { "dumpfile" : "09", "url" :"http://pda.weather.gov.hk/locspc/android_data/fnd_uc.xml", "handler" : ws09.handler };
var Source10 = { "dumpfile" : "10", "url" :"http://pda.weather.gov.hk/locspc/android_data/7days_gs_c.xml", "handler" : ws10.handler };


// http://www.weather.gov.hk/wxinfo/json/one_json.xml?_=$time$"

// http://pda.weather.gov.hk/locspc/android_data/7days_gs_c.xml

// http://www.weather.gov.hk/m/home.htm

// http://pda.weather.gov.hk/locspc/android_data/fnd_e.xml          ; //n day forecast
// http://pda.weather.gov.hk/locspc/android_data/flw_wxicons.xml   ; //weather text and icon
// http://pda.weather.gov.hk/locspc/android_data/gridData/0609_en.xml ; // current weather for TY1
// http://maps.weather.gov.hk/ocf/dat/TY1.xml

var fullDataSource = [Source01, Source02, Source03, Source04, Source05, Source06];
var m1_DataSource = [Source01, Source02, Source03, Source04, Source05, Source06];
var m2_DataSource = [Source01, Source02, Source03, Source04, Source06];
var m3_DataSource = [Source06];
var m4_DataSource = [Source07];
var mcu_DataSource = [Source01,Source02,Source03,Source06, Source07, Source10];
var z_DataSource = [Source07, Source10];

function getWeather(datasoruce, parms, response) {
    var returnCnt = 0;   
    var results = [];   
    for (i in datasoruce) {
        var url = UTIL.modifyUrl(datasoruce[i].url, parms);
        request(getHttpOptions(url), function(error, res, body) {
            results.push({"index" : i, "error" :  error, "res" : res, "body" : body});
            returnCnt++;
            if (returnCnt == datasoruce.length) {
                UTIL.goProcessResults(datasoruce, parms, results, response);
            }
        }
    )};
}
