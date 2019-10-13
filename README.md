# HKWeather_auto


Data extracted from HK Observatory web site, and converted into simple data format for using in MCU as local weather station.  Navigate to "http://{hostname}:{port}/h" for available options



**GitHub Source:**		https://github.com/Super169/HKWeather 

**Docker Image:**		 https://cloud.docker.com/repository/docker/super169/hkweather 

​									***Port used:*** 8080



| Version | Desscription                                                 |
| ------- | ------------------------------------------------------------ |
| 1.0     | First release with WiFi Clock application                    |
| 1.1     | Fix the problem in [HKO data source](http://maps.weather.gov.hk/ocf/text_e.html?mode=0&station=HKO) which may have missing data.<br />Use the icon from [Android 7 days forecast](http://pda.weather.gov.hk/locspc/android_data/7days_gs_c.xml) if available. |
| 2.0     | Include Chinese forecasting message, and change the delimitator from "\|" to "\|\|" to avoid Chinese characters. |
| 2.1     | Add epoch time in result                                     |
| 2.2     | HKO has made some change which will return https in request.href even called with http.  So, it has to ignore http or https in checking url. |
| 2.3     | Update libraries to latest version, and setup automated build from GitHub to Docker Hub. |



As automated build may cause error with previous source, source code in GitHub starts from version 2.3.



**<u>Known issue:</u>**

HKO may have different teams working on the weather prediction, and the information has not synchronized, so there has different prediction from HKO, So, the data returned from this service may not match the one you are using even both of them may comes from HKO.

Due to the problem in http://pda.weather.gov.hk/locspc/android_data/7days_gs_c.xml, it can return the information of day 0 - 6, or day 1 - 7, which will cause missing data in first or last date, and the system will use the data from http://maps.weather.gov.hk/ocf/text_e.html. Looking for a better source which can cover all required information.