// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------
//
// Usage: 
// ------------------------------------------------------------------------------

/* global $http, ajsLog */

angular.module('ajs-util', [])
.service ('ajsUtil', ['$http', 'ajsLog', function ($http, ajsLog) {

    var self = {};

    self.isNullOrEmpty = function (txt) {
        var ret = (txt === null || txt === undefined);
        if (typeof(txt) === 'string' || Array.isArray(txt)) {
            ret = ret || (txt.length === undefined || txt.length <= 0);
        }
        return ret;
    };

    self.strEndsWith = function (str, tok) {
        // str.endsWith(tok) is not available on Safari!
        return (str.lastIndexOf(tok) == (str.length - tok.length));
    };

    // used to pull clientId/backendServer from url query (PC)
    self.getUrlQueryParamByName = function (name, url) {
        try {
            if (!url) url = window.location.href; // .toLowerCase();

            if (self.strEndsWith(url, '#/')) {
                url = url.substr(0, url.length - 2);
            }

            // name = name.toLowerCase();
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
            var results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            var ret = decodeURIComponent(results[2].replace(/\+/g, " "));
            return ret.trim();
        }
        catch (err) {
            if (ajsLog.isEnabledError()) ajsLog.error('ajsUtil.getUrlQueryParamByName(): error - ' + err);
            return null;
        }
    };

    self.getAppArgValue = function(arg_name, default_value) {
        var ret = self.getUrlQueryParamByName(arg_name);
        if (ret === null) ret = default_value;
        return ret;
    };

    self.getAppArgValueInt = function(arg_name, default_value) {
        var ret = self.getAppArgValue(arg_name);
        try {
            if (!self.isNullOrEmpty(ret)) {
                ret = parseInt(ret);
            }
            else {
                ret = default_value;
            }
        }
        catch(err) {
            ret = default_value;
        }
        return ret;
    };

    self.getHtmlContent = function(url, onDone) {
        try {
            var request = $http({
                method: "GET",
                withCredentials: false,
                headers: {'Cache-Control': 'no-cache'},
                url: url
            });

            request.then(
                function (res) {
                    if (res.status == 200) {
                        onDone(res.data);
                    }
                    else {
                        if (onDone) onDone(null);
                    }
                },
                function (res) {
                    if (onDone) onDone(null);
                }
            );
        }
        catch (err) {
            if (onDone) onDone(null);
        }
    };

    self.getJSONFile = function (url, onDone, onError) {
        if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsUtil.getJSONFile(" + url + "): ");
        try {
            var request = $http({
                method: "GET",
                withCredentials: false,
                headers: {'Cache-Control': 'no-cache'},
                url: url
            });

            request.then(
                function (res) {
                    if (res.status == 0 || res.status == 200) {
                        var json = res.data;
                        if (json && typeof json === 'string') {
                            json = JSON.parse(json);
                        }
                        if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsUtil.getJSONFile(" + url + "): ok - " + JSON.stringify(json));
                        if (onDone) onDone(json);
                    }
                    else {
                        if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsUtil.getJSONFile(" + url + "): failed 1 - " + JSON.stringify(res));
                        if (onDone) onDone(null);
                        if (onError) onError(res);
                    }
                },
                function (res) {
                    if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsUtil.getJSONFile(" + url + "): failed 0 - " + JSON.stringify(res));
                    if (onDone) onDone(null);
                    if (onError) onError(res);
                }
            );
        }
        catch (err) {
            if (ajsLog.isEnabledDebug()) ajsLog.debug("ajsUtil.getJSONFile(" + url + "): exception - " + err);
            if (onDone) onDone(null);
            if (onError) onError(err);
        }
    };    

    // Verify MMDDYYYY for now
    self.isValidDate = function(dob) {
        try {
            var mm = parseInt(dob.slice(0, 2));
            var dd = parseInt(dob.slice(2, 4));
            var yy = parseInt(dob.slice(4));
            if (mm <= 0 || mm > 12) return false;
            if (yy <= 0) return false;
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (dd <= 0 || dd > ListofDays[mm - 1]) return false;
            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if ((lyear == false) && (dd >= 29)) {
                    return false;
                }
                if ((lyear == true) && (dd > 29)) {
                    return false;
                }
            }
            // TODO: check for [date of birth] not in the future!
            return true;
        }
        catch (err) {
            return false;
        }
    };

    self.atoi = function(a) {
        var str = "0";
        if (a !== undefined && a.length !== undefined) {
            for (var i = 0; i < a.length; i++) {
                str += a[i];
            }
        }
        return parseInt(str);
    };

    self.utf8_to_b64 = function (str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    };

    self.b64_to_utf8 = function (str) {
        return decodeURIComponent(escape(window.atob(str)));
    };

    self.blob_to_b64 = function (blob, onDone) {
        try {
            var fileReader = new window.FileReader();
            fileReader.readAsDataURL(blob);
            fileReader.onloadend = function() { 
                if ($.isFunction(onDone)) onDone(fileReader.result);
            }    
        }
        catch(err) {
            if ($.isFunction(onDone)) onDone(null);
        }
    };
    
    self.isUrlAvailable = function (url, onResult) {
        try {
            if (!url) {
                onResult(false);
                return;
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if ($.isFunction(onResult)) {
                        var ok = (this.status == 200); // || this.status == 0);
                        onResult(ok);
                    }
                }
            };
            xhttp.open("HEAD", url, true);
            xhttp.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            xhttp.send();
        }
        catch (err) {
            if (ajsLog.isEnabledError()) ajsLog.error("ajsUtil.isUrlAvailable(" + url + "): exception - " + JSON.stringify(err));
            if ($.isFunction(onResult)) {
                onResult(false);
            }
        }
    };
    
    self.formatTime = function (seconds) {
        var ret = "";
        var hours = Math.floor(seconds / 3600);

        if (hours > 0) {
            if (hours < 10)
                ret += "0" + hours;
            else
                ret += hours;
            ret += ":";
        }

        var minutes = Math.floor((seconds - 3600 * hours) / 60);        
        if (minutes < 10)
            ret += "0" + minutes;
        else
            ret += minutes;

        seconds = Math.floor(seconds - 3600 * hours - 60 * minutes);
        ret += ":";
        if (seconds < 10)
            ret += "0" + seconds;
        else
            ret += seconds;

        return ret;
    };

    self.getTimespan = function(timestamp, nowstamp) {
        if (nowstamp === undefined) nowstamp = (new Date()).getTime();        
        return self.formatTime(Math.floor((nowstamp - timestamp) / 1000));
    };

    self.charFill = function(number, size, char) {
        number = number.toString();
        while (number.length < size) number = char + number;
        return number;
    };

    self.zeroFill = function(number, size) {
        return self.charFill(number, size, "0");
    };
    
    self.setFocus = function(elementId) {
    	var e = document.getElementById(elementId);
    	if (e) {
    		e.focus();
    	}
    };
    
    return self;

}]);