const handleCommand = () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {
        currentRequestText = "";
        requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];

        $console.html("");
        isAlreadyClearConsole = true;
        return;
    }

    if (command[0] == "autoclear" && command.length == 1) {
        addNewRespondLine("Auto clear limit is " + autoClearConsoleLimit);
        return;
    }

    if (command[0] == "autoclear" && command.length == 2) {
        let tmp = parseInt(command[1]);
        if (tmp < 0) {addNewRespondLine("Cant set auto clear limit below 0"); return;}
        autoClearConsoleLimit = tmp;

        addNewRespondLine("Auto clear limit is set to " + tmp);
        return;
    }

    addNewRespondLine("Guess nothing to do here...");
}