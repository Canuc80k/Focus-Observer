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

const waitingForAnswer = () => {
    return new Promise((resolve, reject) => {
        $(document).on('keypress', async (e) => {
            console.log(e.which);
            if (e.which == 89) resolve("y");
            if (e.which == 78) resolve("n");
            resolve("else");
        });
    });
}