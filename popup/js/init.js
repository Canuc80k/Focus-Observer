let requestList, respondList;
let requestLinesHeight, respondLinesHeight;
let $console;

const checkDataAvailable = (data, dataType) => {
    if (data != undefined && data.constructor.name == dataType) return true;
    return false;
}

window.onload = () => {
    $console = $("#console");
    chrome.storage.sync.get().then((data) => {
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];
        if (checkDataAvailable(data.requestList, "Array")) requestList = data.requestList;
        if (checkDataAvailable(data.respondList, "Array")) respondList = data.respondList;
        if (checkDataAvailable(data.requestLinesHeight, "Array")) requestLinesHeight = data.requestLinesHeight;
        if (checkDataAvailable(data.respondLinesHeight, "Array")) respondLinesHeight = data.respondLinesHeight;
        
        console.log(requestList);
        console.log(respondList);
        console.log(requestLinesHeight);
        console.log(respondLinesHeight);
        
        if (requestList.length) buildOldGUI();
        addCurrentRequestLine();
    });
};