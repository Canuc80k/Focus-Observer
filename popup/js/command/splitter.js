const handleCommand = () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {
        clear(); return;
    }

    if (command[0] == "autoclear") {
        if (command.length == 1) {
            showAutoClearCommand(); 
            return;
        }
        if (command.length == 2) {
            if (command[1] == "-s" || command[1] == "-show") showAutoClear(); 
            else if (command[1] == "-d" || command[1] == "-default") autoClear(Number.MAX_SAFE_INTEGER); 
            else autoClear(command[1]); 
            return;
        }

        addNewRespondLine("autoclear arguments aren't available");
        return;
    }

    if (command[0] == "block") {
        if (command.length == 1) {
            blockCurrentWebsite();
            return;
        }

        addNewRespondLine("block arguments aren't available");
        return;
    }

    if (command[0] == "unblock") {
        if (command.length == 2) {
            if (command[1] == "-a" || command[1] == "-all") unblockAllWebsite();
            return;
        }
    }
    addNewRespondLine("Guess nothing to do here...");
}