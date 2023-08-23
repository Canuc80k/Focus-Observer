const clear = () => {
    currentRequestText = "";
    requestList = [], respondList = [], requestLinesHeight = [], respondLinesHeight = [];

    $console.html("");
    inClearConsoleProgress = true;
}

const showAutoClearCommand = () => {
    let respond = "* autoclear -s: log current auto clear limit\n\n";
    respond += "* autoclear -d: set auto clear limit to default\n\n";
    respond += "* autoclear X: set auto clear limit to X";
    addNewRespondLine(respond);
}

const showAutoClear = () => {
    addNewRespondLine("Auto clear limit is " + autoClearConsoleLimit);
}

const autoClear = (limitFromRequestLine) => {
    let newLimit = parseInt(limitFromRequestLine);
    if (isNaN(newLimit)) {addNewRespondLine("Auto clear limit must be a non-negative number"); return;}
    if (newLimit < 0) {addNewRespondLine("Cant set auto clear limit below 0"); return;}
    
    if (limitFromRequestLine == Number.MAX_SAFE_INTEGER) {
        autoClearConsoleLimit = newLimit;
        addNewRespondLine("Auto clear limit is set to default");
    } else {
        autoClearConsoleLimit = newLimit;
        addNewRespondLine("Auto clear limit is set to " + autoClearConsoleLimit);
        return;
    }
}