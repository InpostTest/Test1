
//ToDo: JSDOCS, CACHE

//logger type enum
var LoggerTypes;
(function (LoggerTypes) {
    LoggerTypes[LoggerTypes["console"] = 0] = "console";
})(LoggerTypes || (LoggerTypes = {}));

//logger service class
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

//xhr utils service class
var XhrUtils = (function () {

    //constructor
    function XhrUtils() {
    }

    XhrUtils.prototype.get = function (url, loadCallback, errorCallback) {
        
        var req = new XMLHttpRequest();
        req.callback = loadCallback;
        req.onload = function() {
            if (this.readyState === 4)
                  if (this.status === 200) 
                        this.callback(JSON.parse(this.responseText));
            };
        req.onerror = errorCallback;
        req.open("GET", url, true);
        req.send(null);
    };

    return XhrUtils;
})();

//list viewer class
var ListViewer = (function () {
	
	//constructor
    function ListViewer(element, restURI, logger, xhr) {

        this.element = element;
        this.restURI = restURI;
        this.loggerService = logger;
        this.xhrService = xhr;
        this.loggerService.log("WIDGET INITIALIZE");
    };

    ListViewer.prototype.loadData = function () {

        this.xhrService.get(this.restURI, this.loadSuccess.bind(this), this.loadError.bind(this));
    };

    ListViewer.prototype.loadSuccess = function (data) {

        this.data = data._embedded.machines;
        this.render.call(this);
    };

    ListViewer.prototype.loadError = function (xhr) {

        this.loggerService.log("ERROR");
    };

    ListViewer.prototype.render = function () {

        var targetDiv = this.element;
        var listContent = this.getTemplate();
        targetDiv.appendChild(listContent);
    };

    ListViewer.prototype.getTemplate = function () {

        var str = "";
        for (var i = 0; i < this.data.length; i++) {
            str += this.data[i].id + ", ";
        }

        var newDiv = document.createElement("div");
        var newContent = document.createTextNode(str);
        newDiv.appendChild(newContent);

        return newDiv;
    };

    return ListViewer;
})();

window.onload = function () {

    var mainLogger = new Logger(LoggerTypes.console);
    mainLogger.log("SDK INITIALIZE");

    var xhrUtils = new XhrUtils();

    var listConfig = {
        restURI: "https://api-pl.easypack24.net/v4/machines?type=0",
        el: document.getElementById('content')
    };

    var listViewer = new ListViewer(listConfig.el, listConfig.restURI, mainLogger, xhrUtils);

    listViewer.loadData();
};