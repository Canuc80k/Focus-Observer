const createCommandInput = (currID, text) => {
    $("#console").append(createConsoleLineElement(currID));
    let currInputObject = $("#" + currID);
    currInputObject.prop('readonly', true);
    currInputObject.text(text);
}

const createNewCommandInput = () => {
    let currID = requestList.length;
    let newID = currID + 1;
    let currInputObject = $("#" + currID);

    currInputObject.blur();
    currInputObject.prop('readonly', true);
    requestList.push(currInputObject.val());
    console.log(requestList);
    chrome.storage.sync.set({"requestList": requestList, "respondList": {}}, () => {
        console.log("Asd");
    });
    
    $("#console").append(createConsoleLineElement(newID));
    
    let newInputObject = $("#" + newID);
    setTimeout(() => {newInputObject.focus();});
    newInputObject.bind('input propertychange', (e) => {
        newInputObject.css("height", countLines(e.target) * fontSize + "rem");
    });
}

const handleCommand = () => {
    // currRespondID = currRespondID + 1;
    // $("#console").append(createRespondConsoleLineElement(currRespondID));
    // setTimeout(() => {$("#" + currRespondID).focus();});
}

$(document).on('keypress', (e) => {
    if (e.which == 13) {
        handleCommand();
        createNewCommandInput();
    }
});