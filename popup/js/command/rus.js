const askForConfirm = async () => {
    addNewRespondLine("Are u sure [Y/N]:");
    let respondID = respondList.length; 
    isWaitingForConfirm = true;
    $rusLine = $("#r" + respondID);
    $rusLine.prop('readonly', false);
    $rusLine.focus();
    $("#" + requestList.length).prop("readonly", true); 
    const promise = await waitingForAnswer();

    $("#r" + respondList.length).remove();
    isWaitingForConfirm = false;
    $rusLine.prop('readonly', true);
    $rusLine.blur();
    return (promise == "y");
}

const waitingForAnswer = async () => {
    return new Promise((resolve) => {
        $("#r" + respondList.length).on('keypress', (e) => {
            e.preventDefault();
            if (e.which == 89 || e.which == 121) resolve("y");
            if (e.which == 78 || e.which == 110) resolve("n");
        });
    });
}