// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
// ------------------------------------------------------------------------------

/* global $rootScope, $filter, $log */

angular.module('ajs-cache', [])
.service ('ajsCache', ['ajsLog', 'localStorageService', function (ajsLog, localStorageService) {
    ajsLog.log("=========================== ::ajsCache:: ===========================");
    
    var self = {};

    self._localStorage = localStorageService;

    self.get = function (name, defaultValue) {
        var ret = self._localStorage.get(name);
        if (ret !== undefined && ret !== null) return ret;
        return defaultValue;
    };

    self.set = function (name, value) {
        if (value !== undefined && value !== null) {
            return self._localStorage.set(name, value);
        }
        else {
            return self._localStorage.remove(name);
        }
    };

    self.remove = function (name) {
        return self._localStorage.remove(name);
    };

    self._storeAsCompressedString = function(key, str) {
        if (typeof(str) !== 'string') str = JSON.stringify(str);
        var compressed_str = LZString.compressToUTF16(str);
        return self._localStorage.set(key, compressed_str);
    };

    self._retrieveFromCompressedString = function(key, default_value) {
        try {
            var str = self._localStorage.get(key);
            if (str != undefined) {
                if (typeof(str) === 'string') {
                    str = LZString.decompressFromUTF16(str);
                    try {
                        var obj = JSON.parse(str);
                        if (obj) str = obj;
                    }
                    catch(err1) {
                        // ignore parsing error
                    }
                }    
            }
            else {
                str = default_value;
            }
            return str;    
        }
        catch(err) {
            return default_value;
        }
    };

    self.setObject = function(key, data) {
        if (data !== undefined && data !== null) {
            return self._storeAsCompressedString(key, data);
        }
        else {
            return self._localStorage.remove(key);
        }
    };

    self.getObject = function (key, default_value) {
        return self._retrieveFromCompressedString(key, default_value);
    };

    self.clearAll = function() {
        self._localStorage.clearAll();
    };

    return self;
    
}]);