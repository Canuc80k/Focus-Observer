let $console;
let requestList, respondList, requestLinesHeight, respondLinesHeight, currentRequestText;
let isAlreadyClearConsole = false;
let autoClearConsoleLimit = Number.MAX_VALUE;

const checkDataAvailable = (data, dataType) => {
    if (data != undefined && data.constructor.name == dataType) return true;
    return false;
}

const autoClearExecute = () => {
    if (autoClearConsoleLimit == 0) {
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];
        return;
    }
    
    if (requestList.length > autoClearConsoleLimit) {
        requestList = requestList.slice(- autoClearConsoleLimit);
        respondList = respondList.slice(- autoClearConsoleLimit);
        requestLinesHeight = requestLinesHeight.slice(- autoClearConsoleLimit);
        respondLinesHeight = respondLinesHeight.slice(- autoClearConsoleLimit);
    }
}

window.onload = () => {
    $console = $("#console");
    chrome.storage.local.get().then((data) => {
        currentRequestText = "";
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];

        if (checkDataAvailable(data.requestList, "Array")) requestList = data.requestList;
        if (checkDataAvailable(data.respondList, "Array")) respondList = data.respondList;
        if (checkDataAvailable(data.requestLinesHeight, "Array")) requestLinesHeight = data.requestLinesHeight;
        if (checkDataAvailable(data.respondLinesHeight, "Array")) respondLinesHeight = data.respondLinesHeight;
        if (checkDataAvailable(data.currentRequestText, "String")) currentRequestText = data.currentRequestText; 
        if (checkDataAvailable(data.autoClearConsoleLimit, "Number")) autoClearConsoleLimit = data.autoClearConsoleLimit;

        autoClearExecute();

        console.log(requestList);
        console.log(respondList);
        console.log(requestLinesHeight);
        console.log(respondLinesHeight);
        console.log(currentRequestText);

        if (requestList.length) buildOldGUI();
        addCurrentRequestLine(currentRequestText);
    });
};