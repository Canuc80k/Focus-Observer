const handleCommand = () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {
        clear(); return;
    }
    if (command[0] == "autoclear") {
        if (command.length == 1) {
            showAutoClearCommand(); 
        }
        else if (command.length == 2) {
            if (command[1] == "-s" || command[1] == "-show") showAutoClear(); 
            else if (command[1] == "-d" || command[1] == "-default") autoClear(Number.MAX_SAFE_INTEGER); 
            else autoClear(command[1]); 
            return;
        }

        addNewRespondLine("autoclear arguments aren't available");
        return;
    }

    addNewRespondLine("Guess nothing to do here...");
}