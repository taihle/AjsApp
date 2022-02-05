// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
//
// Usage: in the main App module add 'ajs-log'
//        
// ------------------------------------------------------------------------------

/* global $rootScope, $filter, $log */

angular.module('ajs-log', [])
.service ('ajsLog', ['$rootScope', '$filter', '$log', function ($rootScope, $filter, $log) {

    var self = {};

    self.LOG_LEVELS = { OFF: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4, TRACE: 5, ALL: 6 };

    self.LOG_LEVELS_LABEL = ["", "error", "warn", "info", "debug", "trace", "log"];

    self._level = 0;

    self.osd = false; // on-screen debug

    self.init = function(cfg) {
        if (!cfg) return;

        if (cfg.level != undefined) {
            self._level = cfg.level;
        }

        if (cfg.use_e3_log) {
            self._use_e3_log = cfg.use_e3_log;
        }

        if (cfg.osd !== undefined) {
            self.osd = cfg.osd;
        }
    };

    function getTimeStamp() {
        return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss.sss');
    };

    self.log = function(msg, level) {
        msg = getTimeStamp() + " " + self.LOG_LEVELS_LABEL[level] + " " + msg;
        if (self.osd) {
            $rootScope.$broadcast("osd_log", msg);
        }
        $log.log(msg);
        return msg;
    };

    self.isEnabledDebug = function() {
        return (self._level >= self.LOG_LEVELS.DEBUG);
    };

    self.debug = function (msg) {
        self.log(msg, self.LOG_LEVELS.DEBUG);
    };

    self.isEnabledInfo = function() {
        return (self._level >= self.LOG_LEVELS.INFO);
    };

    self.info = function (msg) {
        self.log(msg, self.LOG_LEVELS.INFO);
    };

    self.isEnabledWarn = function() {
        return (self._level >= self.LOG_LEVELS.WARN);
    };

    self.warn = function (msg) {
        self.log(msg, self.LOG_LEVELS.WARN);
    };

    self.isEnabledError = function() {
        return (self._level >= self.LOG_LEVELS.ERROR);
    };

    self.error = function (msg) {
        self.log(msg, self.LOG_LEVELS.ERROR);
    };

    return self;
}]);