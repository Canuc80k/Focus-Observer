const askForConfirm = async () => {
    addNewRespondLine("Are u sure [Y/N]:");
    let respondID = respondList.length; 
    $rusLine = $("#r" + respondID);
    $("#" + requestList.length).prop("readonly", true); 
    $rusLine.prop('readonly', false);
    $rusLine.focus();
    const promise = await waitingForAnswer();
    $("#r" + respondList.length).remove();
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