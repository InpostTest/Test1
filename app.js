
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
    function ListViewer(element, restURI, logger, xhr) {

        this.element = element;
        this.restURI = restURI;
        this.loggerService = logger;
        this.xhrService = xhr;
        this.loggerService.log("WIDGET INITIALIZE");
    };

    ListViewer.prototype.loadData = function () {

        var me = this;

        loadFile(this.restURI);

        function xhrSuccess () { 
            
            me.data = JSON.parse(this.responseText)._embedded.machines;
            me.render.call(me);
        }

        function xhrError () { 
        }

        function loadFile (url, callback) {

          var req = new XMLHttpRequest();
          req.callback = callback;
          req.onload = xhrSuccess;
          req.onerror = xhrError;
          req.open("get", url, true);
          req.send(null);
        }
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

    var listConfig = {
        restURI: "https://api-pl.easypack24.net/v4/machines?type=0",
        el: document.getElementById('content')
    }

    var listViewer = new ListViewer(listConfig.el, listConfig.restURI, mainLogger);

    listViewer.loadData();
};