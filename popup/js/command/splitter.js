const handleCommand = () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {
        currentRequestText = "";
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];

        $console.html("");
        isAlreadyClearConsole = true;
        return;
    }

    addNewRespondLine("Guess nothing to do here...");
}