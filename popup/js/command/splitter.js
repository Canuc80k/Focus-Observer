const handleCommand = async () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {
        clear(); 
        return;
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
            showBlockCommand();
            return;
        }
        if (command.length == 2) {
            if (command[1][0] != '-') {
                await blockSpecificWebsite(command[1]);
                return;
            }
            if (command[1] == "-c" || command[1] == "-current") {
                await blockCurrentWebsite();
                return;
            }
            if (command[1] == "-s" || command[1] == "-show") {
                showBlockWebsite();
                return;
            }
        }
        addNewRespondLine("block arguments aren't available");
        return;
    }

    if (command[0] == "unblock") {
        if (command.length == 2) {
            if (command[1] == "-a" || command[1] == "-all") {
                await unblockAllWebsite();
                return;
            }
            if (command[1] == "-s" || command[1] == "-show") {
                showBlockWebsite();
                return;
            }
            if (command[1][0] != '-') {
                await unblockSpecificWebsite(command[1]);
                return;
            }
        }
        addNewRespondLine("unblock arguments aren't available");
        return;
    }

    if (command[0] == "reload") {
        if (command.length == 1) {
            showReloadCommands();
            return;
        }
        if (command.length == 2) {
            if (command[1] == "-c" || command[1] == "-current") {
                await reloadCurrentPage();
                return;
            }
            if (command[1] == "-b" || command[1] == "-block") {
                await reloadBlockPage();
                return;
            }
            if (command[1] == "-a" || command[1] == "-all") {
                await reloadAllPage();
                return;
            }
        }
        addNewRespondLine("reload arguments aren't available");
        return;
    }
    addNewRespondLine("Guess nothing to do here...");
}