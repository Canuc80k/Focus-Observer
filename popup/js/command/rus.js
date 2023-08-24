const askForConfirm = async () => {
    addNewRespondLine("Are u sure [Y/N]:");
    let respondID = respondList.length; 
    $rusLine = $("#r" + respondID);
    $rusLine.prop('readonly', false);
    $rusLine.focus();
    const promise = await waitingForAnswer();
    $("#r" + respondList.length).remove();
    $rusLine.prop('readonly', true);
    $rusLine.blur();
    return (promise == "y");
}

const waitingForAnswer = async () => {
    return new Promise((resolve, reject) => {
        $("#r" + respondList.length).on('keypress', (e) => {
            e.preventDefault();
            if (e.which == 89) resolve("y");
            if (e.which == 78) resolve("n");
            resolve("else");
        });
    });
}