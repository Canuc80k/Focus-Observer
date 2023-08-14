const createNewCommandInput = () => {
    $("#" + currID).blur();
    $('#' + currID).prop('readonly', true);
    
    currID = currID + 1;
    $("#console").append(createConsoleLineElement(currID));
    setTimeout(() => {$("#" + currID).focus();});

    $("#" + currID).bind('input propertychange', (e) => {
        $("#" + currID).css("height", countLines(e.target) * fontSize + "rem");
    });
}

const handleCommand = () => {
    currRespondID = currRespondID + 1;
    $("#console").append(createRespondConsoleLineElement(currRespondID));
    setTimeout(() => {$("#" + curcurrRespondIDrID).focus();});
}

$(document).on('keypress', (e) => {
    if (e.which == 13) {
        handleCommand();
        createNewCommandInput();
    }
});