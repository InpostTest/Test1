
//logger type enum
var LoggerTypes;
(function (LoggerTypes) {
    LoggerTypes[LoggerTypes["console"] = 0] = "console";
})(LoggerTypes || (LoggerTypes = {}));

//logger class
var Logger = (function () {

    //constructor
    function Logger(loggerType) {
        this.logType = loggerType;
    }

    Logger.prototype.log = function (data) {
        switch (this.logType) {
            case LoggerTypes.console:
                console.log(data);
                break;
        }
    };

    return Logger;
})();

//list viewer class
var ListViewer = (function () {
	
	//constructor
    function ListViewer(element, logger) {
        this.element = element;
        this.logger = logger;
        this.logger.log("SDK INITIALIZE");
    }
	
    return ListViewer;
})();

window.onload = function () {
	
    var el = document.getElementById('content');
    var listViewer = new ListViewer(el, new Logger(LoggerTypes.console));
};