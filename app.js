/** Global enum with logger output types
 * @readonly
 * @enum {console}
 */ 
var LoggerTypes;
(function (LoggerTypes) {
    LoggerTypes[LoggerTypes["console"] = 0] = "console";
})(LoggerTypes || (LoggerTypes = {}));

/**
 * Logger service.
 * @constructor
 * @param {LoggerType} loggerType - Type of logger output.
 */
var Logger = (function () {

    function Logger(loggerType) {
        this.logType = loggerType;
    }
    
    /**
     * Logs data.
     * @memberof Logger
     * @method
     * @param {object} data - Data to be logged.
     */
    Logger.prototype.log = function (data) {
        switch (this.logType) {
            case LoggerTypes.console:
                console.log(data);
                break;
        }
    };

    return Logger;
})();

/**
 * REST utilities service.
 * @constructor
 */
var XhrUtils = (function () {

    function XhrUtils() {
    }
    
    /**
     * GET rest function.
     * @memberof XhrUtils
     * @method
     * @param {string} url - REST URI.
     * @param {object} loadCallback - Callback to success function.
     * @param {object} errorCallback - Callback to error function.
     */
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

/**
 * Data cache manager service.
 * @constructor
 */
var CacheManager = (function () {

    function CacheManager() {
    }
    
    /**
     * Checks if data is cached.
     * @memberof CacheManager
     * @method
     * @param {string} id - Id of item in cache.
     * @returns {boolean} Is cached.
     */
    CacheManager.prototype.isCached = function (id) {

        if(sessionStorage.getItem(id))
            return true;
        else
            return false;
    };
    
    /**
     * Returns cached data.
     * @memberof CacheManager
     * @method
     * @param {string} id - Id of item in cache.
     * @returns {object} Data from cache.
     */
    CacheManager.prototype.get = function (id) {

        return JSON.parse(sessionStorage.getItem(id));
    };
    
    /**
     * Saves data to cache.
     * @memberof CacheManager
     * @method
     * @param {string} id - Id of item in cache.
     * @param {string} data - Data to be cached.
     */
    CacheManager.prototype.set = function (id, data) {

        sessionStorage.setItem(id, JSON.stringify(data));
    };
    
    /**
     * Clears cache.
     * @memberof CacheManager
     * @method
     * @param {string} id - Id of item in cache.
     */
    CacheManager.prototype.clear = function (id) {

        sessionStorage.removeItem(id);
    };

    return CacheManager;
})();

/**
 * Paczkomaty list viewer widget.
 * @constructor
 * @param {object} config Configuration object for list viewer widget.
 * @param {string} config.elementId - Id of output element in DOM.
 * @param {restURI} config.restURI - URI of REST with data.
 * @param {typeID} config.typeId - ID of data cache element.
 * @param {Logger} config.logger - Logger service object reference.
 * @param {XhrUtils} config.xhrUtils - Rest service object reference.
 * @param {CacheManager} config.cacheManager - Cache manager service object reference.
 */
var ListViewer = (function () {
	
    function ListViewer(config) {

        this.element = document.getElementById(config.elementId);
        this.restURI = config.restURI;
        this.typeId = config.typeId;
        this.loggerService = config.logger;
        this.xhrService = config.xhrUtils;
        this.cacheService = config.cacheManager;

        this.loggerService.log("WIDGET INITIALIZE");
    };
    /**
     * Initializes widget.
     * @memberof ListViewer
     * @method
     */
    ListViewer.prototype.start = function () {

        if(this.cacheService.isCached(this.typeId))
            this.load(this.cacheService.get(this.typeId));
        else
            this.xhrService.get(this.restURI, this.loadSuccess.bind(this), this.loadError.bind(this));
    };

    ListViewer.prototype.load = function(data) {

        this.data = data._embedded.machines;
        this.render.call(this);
    };

    ListViewer.prototype.loadSuccess = function(data) {

        this.cacheService.set(this.typeId, data);
        this.load(data);
        this.loggerService.log("DATA LOAD SUCCESS");
    };

    ListViewer.prototype.loadError = function(xhr) {

        this.loggerService.log("DATA LOAD ERROR");
    };

    ListViewer.prototype.render = function() {

        var targetDiv = this.element
            ,listContent = this.getTemplate();

        targetDiv.appendChild(listContent);
    };

    ListViewer.prototype.getTemplate = function() {

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