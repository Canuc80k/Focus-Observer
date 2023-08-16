let requestList, respondList;

const buildOldGUI = () => { 
    console.log("ASd");
    for (let i = 0; i < requestList.length; i ++) {
        console.log(requestList[i]);
        createCommandInput(i, requestList[i]);
    }
}

window.onload = () => {
    chrome.storage.sync.get().then((data) => {
        requestList = respondList = [];
        console.log(data.requestList);
        if (data.requestList != undefined && data.requestList.constructor === Array) requestList = data.requestList;
        // if (data.respondList.constructor === Array) respondList = data.respondList;
        
        if (requestList.length == 0) {
            $("#console").append(createConsoleLineElement(0));
            let firstInputObject = $("#0");
            setTimeout(() => {firstInputObject.focus();});
            firstInputObject.bind('input propertychange', (e) => {
                firstInputObject.css("height", countLines(e.target) * fontSize + "rem");
            });
        } else {
            buildOldGUI();
            $("#console").append(createConsoleLineElement(requestList.length));
            let firstInputObject = $("#" + requestList.length);
            setTimeout(() => {firstInputObject.focus();});
            firstInputObject.bind('input propertychange', (e) => {
                firstInputObject.css("height", countLines(e.target) * fontSize + "rem");
            });
        }
    });
};