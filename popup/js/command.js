const handleCommand = () => {
    // currRespondID = currRespondID + 1;
    // $("#console").append(createRespondConsoleLineElement(currRespondID));
    // setTimeout(() => {$("#" + currRespondID).focus();});
}

$(document).on('keypress', (e) => {
    if (e.which == 13) {
        handleCommand();
        archiveCurrentLine();
        addNewRequestLine();
    }
});