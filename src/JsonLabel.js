module.exports.PARM_DISTRICT_IDX = "districtIdx";
module.exports.PARM_DISTRICT_CODE = "districtCode";
module.exports.PARM_DISTRICT_CHI = "districtChi";
module.exports.PARM_DISTRICT_ENG = "districtEng";
module.exports.PARM_DISTRICT_RNAME = "districtRName";

// module.exports.RESULT_READY = RESULT_READY;

module.exports.RESULT_READY = function(s) { return (s ? "RDY" : "Ready");}

module.exports.RT_DISTRICT_CODE = function(s) { return ( s ? "DST" : "District Code");}
module.exports.RT_DISTRICT_ENG = function(s) { return ( s ? "DEN" : "English");}
module.exports.RT_DISTRICT_CHI = function(s) { return ( s ? "ECN" : "Chinese");}

// ws01
module.exports.CW_ROOT = function(s) { return ( s ? "CW" : "Current Weather");}
module.exports.CW_PICTURE_ICON = function(s) { return ( s ? "PIC" : "Picture Icon");}
module.exports.CW_HK_TEMP = function(s) { return ( s ? "HKT" : "HK Temperature");}
module.exports.CW_HK_HUMI = function(s) { return ( s ? "HKH" : "HK Humidity");}
module.exports.CW_UV_INDEX = function(s) { return ( s ? "UIX" : "UV Index");}
module.exports.CW_UV_INTENSITY = function(s) { return ( s ? "UIT" : "UV Intensity");}
module.exports.CW_LOCAL_TEMP = function(s) { return ( s ? "LT" : "Local Temperature");}

// ws02
module.exports.RW_ROOT = function(s) { return ( s ? "RW" : "Regional Weather");}
module.exports.RW_TEMP = function(s) { return ( s ? "T" : "Temperature");}
module.exports.RW_HUMI = function(s) { return ( s ? "H" : "Humidity");}
module.exports.RW_TEMP_HIGH = function(s) { return ( s ? "TH" : "Temperature (High)");}
module.exports.RW_TEMP_LOW = function(s) { return ( s ? "TL" : "Temperature (Low)");}

// ws03
module.exports.WS_ROOT = function(s) { return (s ? "WS" : "Weather Signal");}
module.exports.WS_TYPHOON = function(s) { return (s ? "TYP" : "Typhoon");}
module.exports.WS_RAINSTORM = function(s) { return (s ? "RAN" : "Rain");}

// ws04
module.exports.FC_ROOT = function(s) { return ( s ? "FI" : "Forecast Info");}
module.exports.FC_INDEX = function(s) { return ( s ? "IDX" : "Index");}
module.exports.FC_DATE = function(s) { return ( s ? "DT" : "Date");}
module.exports.FC_PICTURE_ICON = function(s) { return ( s ? "PIC" : "Picture Icon");}
module.exports.FC_WEEKDAY = function(s) { return ( s ? "WK" : "Weekday");}
module.exports.FC_WEEKDAY_DESC = function(s) { return ( s ? "WKD" : "Weekday Desc");}
module.exports.FC_TEMP_HIGH = function(s) { return ( s ? "TH" : "Temperature (High)");}
module.exports.FC_TEMP_LOW = function(s) { return ( s ? "TL" : "Temperature (Low)");}


// ws05
module.exports.SF_ROOT = function(s) { return ( s ? "SDF" : "Severval Days Forecast");}
module.exports.SF_INDEX = function(s) { return ( s ? "IDX" : "Index");}
module.exports.SF_DATE = function(s) { return ( s ? "DT" : "Date");}
module.exports.SF_WEEKDAY = function(s) { return ( s ? "WK" : "Weekday");}
module.exports.SF_WEEKDAY_DESC = function(s) { return ( s ? "WKD" : "Weekday Desc");}
module.exports.SF_PICTURE_ICON = function(s) { return ( s ? "PIC" : "Picture Icon");}
module.exports.SF_TEMP_HIGH = function(s) { return ( s ? "TH" : "Temperature (High)");}
module.exports.SF_TEMP_LOW = function(s) { return ( s ? "TL" : "Temperature (Low)");}
module.exports.SF_HUMI_HIGH = function(s) { return ( s ? "HH" : "Humidity (High)");}
module.exports.SF_HUMI_LOW = function(s) { return ( s ? "HL" : "Humidity (Low)");}

// ws06
module.exports.DF_ROOT = function(s) { return ( s ? "DF" : "Detail Forecast");}
module.exports.DF_DAY_0 = function(s) { return ( s ? "DAY_0" : "Start Date");}
module.exports.DF_DAY_PIC = function(s) { return ( s ? "PIC_" : "Picture Icon ");}
module.exports.DF_DAY_TEMP_LOW = function(s) { return ( s ? "TL_" : "Temperature (Low) ");}
module.exports.DF_DAY_TEMP_HIGH = function(s) { return ( s ? "TH_" : "Temperature (High) ");}
module.exports.DF_DAY_RAIN = function(s) { return ( s ? "RAIN" : "Change of Rain ");}
module.exports.DF_HOUR_TIME = function(s) { return ( s ? "HR_" : "Start Hour ");}
module.exports.DF_HOUR_PIC = function(s) { return ( s ? "HPIC_" : "Hour Picture ");}
module.exports.DF_HOUR_TEMP = function(s) { return ( s ? "HT_" : "Temperature ");}
module.exports.DF_HOUR_HUMI = function(s) { return ( s ? "HH_" : "Humidity ");}

// ws07
module.exports.OJ_ROOT = function(s) { return ( s ? "OJ" : "One JSON");}


// ws08
module.exports.PF_ROOT = function(s) { return ( s ? "PF" : "PDA Forecast");}

// ws09


// ws10
module.exports.P7_ROOT = function(s) { return ( s ? "P7" : "PDA 7 Days");}
module.exports.P7_DAY = function(s) { return ( s ? "DAY" : "Date");}
module.exports.P7_TEMP_LOW = function(s) { return ( s ? "TL" : "Temperature (Low)");}
module.exports.P7_TEMP_HIGH = function(s) { return ( s ? "TL" : "Temperature (High)");}
module.exports.P7_HUMI_LOW = function(s) { return ( s ? "HL" : "Humidity (Low)");}
module.exports.P7_HUMI_HIGH = function(s) { return ( s ? "HH" : "Humidity (High)");}
module.exports.P7_PIC = function(s) { return ( s ? "PIC" : "Picture Icon");}
module.exports.P7_WIND = function(s) { return ( s ? "WN" : "Wind");}
module.exports.P7_WEATHER = function(s) { return ( s ? "WE" : "Weather");}
module.exports.P7_WEEKDAY = function(s) { return ( s ? "WD" : "Week Day");}

module.exports.SIM_DISTRICT_CODE = function(s) { return ( s ? "DST" : "District Code");}
module.exports.SIM_PICTURE_ICON = function(s) { return ( s ? "PIC" : "Picture Icon ");}
module.exports.SIM_TEMP = function(s) { return ( s ? "T" : "Temperature ");}
module.exports.SIM_HUMI = function(s) { return ( s ? "H" : "Humidity ");}
module.exports.SIM_RAINSTORM = function(s) { return ( s ? "RAIN" : "Rainstorm Signal");}
module.exports.SIM_TYPHOON = function(s) { return ( s ? "TYP" : "Typhoon Signal");}
module.exports.SIM_DAY_PIC = function(s) { return ( s ? "DPIC_" : "Day Picture ");}
module.exports.SIM_DAY_TEMP_LOW = function(s) { return ( s ? "DTL_" : "Day Temp Low ");}
module.exports.SIM_DAY_TEMP_HIGH= function(s) { return ( s ? "DTH_" : "Day Temp High ");}
module.exports.SIM_DAY_RAIN= function(s) { return ( s ? "DRN_" : "Change of Rain ");}
module.exports.SIM_HOUR_NOW= function(s) { return ( s ? "NOW" : "Current Hour");}
module.exports.SIM_HOUR_0= function(s) { return ( s ? "HR" : "Start Hour");}
module.exports.SIM_HOUR_PIC = function(s) { return ( s ? "HPIC_" : "Hour Picture ");}
module.exports.SIM_HOUR_TEMP = function(s) { return ( s ? "HT_" : "Temperature ");}
module.exports.SIM_HOUR_HUMI = function(s) { return ( s ? "HH_" : "Humidity ");}
