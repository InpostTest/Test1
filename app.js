var ListViewer = (function () {
	
	//constructor
    function ListViewer(element) {
        this.element = element;
    }
	
    return ListViewer;
})();

window.onload = function () {
	
    var el = document.getElementById('content');
    var listViewer = new ListViewer(el);
};