let requestList, respondList;
let $console;

const checkDataAvailable = (data, dataType) => {
    if (data != undefined && data.constructor.name == dataType) return true;
    return false;
}

window.onload = () => {
    $console = $("#console");
    chrome.storage.sync.get().then((data) => {
        requestList = respondList = [];
        if (checkDataAvailable(data.requestList, "Array")) requestList = data.requestList;
        if (checkDataAvailable(data.respondList, "Array")) respondList = data.respondList;

        if (requestList.length) buildOldGUI();
        addCurrentRequestLine();
    });
};