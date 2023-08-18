const handleCommand = () => {
    let command = currentRequestText.trim().split(" ");
    
    if (command[0] == "clear" && command.length == 1) {clear(); return;}
    if (command[0] == "autoclear" && command.length == 1) {showAutoClearCommand(); return;}
    if (command[0] == "autoclear" && command.length == 2 && command[1] == "-s") {showAutoClear(); return;}
    if (command[0] == "autoclear" && command.length == 2 && command[1] == "-show") {showAutoClear(); return;}
    if (command[0] == "autoclear" && command.length == 2 && command[1] == "-d") {autoClear(Number.MAX_SAFE_INTEGER); return;}
    if (command[0] == "autoclear" && command.length == 2 && command[1] == "-default") {autoClear(Number.MAX_SAFE_INTEGER); return;}
    if (command[0] == "autoclear" && command.length == 2) {autoClear(command[1]); return;}

    addNewRespondLine("Guess nothing to do here...");
}