let requestList, respondList;
let requestLinesHeight, respondLinesHeight;
let currentRequestText;
let $console;

console.log("asd".constructor.name);

const checkDataAvailable = (data, dataType) => {
    if (data != undefined && data.constructor.name == dataType) return true;
    return false;
}

window.onload = () => {
    $console = $("#console");
    chrome.storage.sync.get().then((data) => {
        currentRequestText = "";
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];
        console.log(data.currentRequestText);
        if (checkDataAvailable(data.requestList, "Array")) requestList = data.requestList;
        if (checkDataAvailable(data.respondList, "Array")) respondList = data.respondList;
        if (checkDataAvailable(data.requestLinesHeight, "Array")) requestLinesHeight = data.requestLinesHeight;
        if (checkDataAvailable(data.respondLinesHeight, "Array")) respondLinesHeight = data.respondLinesHeight;
        if (checkDataAvailable(data.currentRequestText, "String")) currentRequestText = data.currentRequestText; 

        console.log(requestList);
        console.log(respondList);
        console.log(requestLinesHeight);
        console.log(respondLinesHeight);
        console.log(currentRequestText);

        if (requestList.length) buildOldGUI();
        addCurrentRequestLine(currentRequestText);
    });
};