
//ToDo: JSDOCS

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

//cache manager service class
var CacheManager = (function () {

    //constructor
    function CacheManager() {
    }

    CacheManager.prototype.isCached = function (id) {

        if(sessionStorage.getItem(id))
            return true;
        else
            return false;
    };

    CacheManager.prototype.get = function (id) {

        return JSON.parse(sessionStorage.getItem(id));
    };

    CacheManager.prototype.set = function (id, data) {

        sessionStorage.setItem(id, JSON.stringify(data));
    };

    CacheManager.prototype.clear = function (id, data) {

        sessionStorage.removeItem(id);
    };

    return CacheManager;
})();

//list viewer class
var ListViewer = (function () {
	
	//constructor
    function ListViewer(config) {

        this.element = document.getElementById(config.elementId);
        this.restURI = config.restURI;
        this.typeId = config.typeId;
        this.loggerService = config.logger;
        this.xhrService = config.xhrUtils;
        this.cacheService = config.cacheManager;

        this.loggerService.log("WIDGET INITIALIZE");
    };

    ListViewer.prototype.start = function () {

        if(this.cacheService.isCached(this.typeId))
            this.load(this.cacheService.get(this.typeId));
        else
            this.xhrService.get(this.restURI, this.loadSuccess.bind(this), this.loadError.bind(this));
    };

    ListViewer.prototype.load = function (data) {

        this.data = data._embedded.machines;
        this.render.call(this);
    };

    ListViewer.prototype.loadSuccess = function (data) {

        this.cacheService.set(this.typeId, data);
        this.load(data);
        this.loggerService.log("DATA LOAD SUCCESS");
    };

    ListViewer.prototype.loadError = function (xhr) {

        this.loggerService.log("DATA LOAD ERROR");
    };

    ListViewer.prototype.render = function () {

        var targetDiv = this.element
            ,listContent = this.getTemplate();

        targetDiv.appendChild(listContent);
    };

    ListViewer.prototype.getTemplate = function () {

        var newDiv = document.createElement("div");

        var str = "<select>";
        for (var i = 0; i < this.data.length; i++) {
            str += "<option>" + this.data[i].id + " - " + this.data[i].status + "</option>";
        }
        str += "</select>";

        newDiv.innerHTML = str;

        return newDiv;
    };

    return ListViewer;
})();

//document startup
window.onload = function () {

    var typeId = "machines"
        ,mainLogger = new Logger(LoggerTypes.console)
        ,xhrUtils = new XhrUtils()
        ,cacheManager = new CacheManager();

    mainLogger.log("SDK INITIALIZE");

    var listViewer = new ListViewer({
        elementId: "content",
        restURI: "https://api-pl.easypack24.net/v4/" + typeId + "?type=0",
        typeId: typeId,
        logger: mainLogger,
        xhrUtils: xhrUtils,
        cacheManager: cacheManager
    });

    listViewer.start();
};