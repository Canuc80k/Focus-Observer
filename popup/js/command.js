const handleCommand = () => {
    addNewRespondLine();
}

$(document).on('keypress', (e) => {
    if (e.which == 13) {
        handleCommand();
        archiveCurrentLine();
        addNewRequestLine();
    }
});