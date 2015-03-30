var start = 0;
var ajax = new Ajax();
    var doPoll = function() {
    start = new Date();
    start = start.getTime();
    ajax.doGet('/fakeserver.php?start=' + start, showPoll);
}

window.onload = doPoll;
    
var showPoll = function(str) {
    var pollResult = '';
    var diff = 0;
    var end = new Date();
    if (str == 'ok') {
        end = end.getTime();
        diff = (end - start)/1000;
        pollResult = 'Server response time: ' + diff + ' seconds';
    }
    else {
        pollResult = 'Request failed.';
    }
    printResult(pollResult);
    var pollHand = setTimeout(doPoll, 15000);
}

function printResult(str) {
    var pollDiv = document.getElementById('pollDiv');
    if (pollDiv.firstChild) {
        pollDiv.removeChild(pollDiv.firstChild);
    }
    pollDiv.appendChild(document.createTextNode(str));
}
