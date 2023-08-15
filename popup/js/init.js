let requestList, respondList;

window.onload = () => {
    chrome.storage.sync.get().then((data) => {
        requestList = respondList = [];
        if (data.requestList.constructor === Array) requestList = data.requestList;
        if (data.respondList.constructor === Array) respondList = data.respondList;
        
        if (requestList.length == 0) {
            $("#console").append(createConsoleLineElement(0));
            let firstInputObject = $("#0");
            setTimeout(() => {firstInputObject.focus();});
            firstInputObject.bind('input propertychange', (e) => {
                firstInputObject.css("height", countLines(e.target) * fontSize + "rem");
            });
        }
    });
};