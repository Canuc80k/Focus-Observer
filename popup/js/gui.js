let fontSize = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--fsz'));

const countTextareaLine = (textarea) => {
    let cs = window.getComputedStyle(textarea);
    let lh = parseInt(cs.lineHeight);
    if (isNaN(lh)) lh = parseInt(cs.fontSize);
    
    let result = Math.floor(textarea.scrollHeight / lh);
    if (result == 0) result = 1;
    return result;
}

const getRequestLineInstance = (id) => {
    return "<div class=\"console-line\"><div class=\"console-begin-char\">&gt;&nbsp;&nbsp;</div><textarea id=\"" + id + "\" class=\"console-text\"></textarea></div>";
}

const getRespondLineInstance = (id) => {
    return "<div class=\"console-line\"><textarea id=\"r" + id + "\" class=\"respond-console-text\" readonly=\"true\"></textarea></div>";
}

const addOldRequestLine = (id, text, height) => {
    $console.append(getRequestLineInstance(id));
    let $resquestLine = $("#" + id);
    $resquestLine.prop('readonly', true);
    $resquestLine.text(text);
    $resquestLine.css("height", height + "rem");
}

const addOldRespondLine = (id, text, height) => {
    $console.append(getRespondLineInstance(id));
    let $respondLine = $("#r" + id);
    $respondLine.text(text);
    $respondLine.css("height", height + "rem");
}

const buildOldGUI = () => { 
    for (let i = 0; i < requestList.length; i ++) {
        addOldRequestLine(i, requestList[i], requestLinesHeight[i]);
        addOldRespondLine(i, respondList[i], respondLinesHeight[i]);
    }
}

const addNewRequestLine = () => {
    let newID = requestList.length;
    $console.append(getRequestLineInstance(newID));
    let $requestLine = $("#" + newID);
    
    $requestLine.focus();
    $requestLine.bind('input propertychange', (e) => {
        $requestLine.css("height", countTextareaLine(e.target) * fontSize + "rem");
        currentRequestText = $requestLine.val();
        chrome.storage.local.set({"currentRequestText": currentRequestText}, () => {});
    });
    $requestLine.keydown((e) => {
        if (e.which == 38) {
            e.preventDefault();
            if (!requestList.length) return; 
            currentRequestText = requestList[requestList.length - 1];
            chrome.storage.local.set({"currentRequestText": currentRequestText}, () => {});
            $requestLine.val(currentRequestText);
        }
    });
}

const addNewRespondLine = (text) => {
    let newID = respondList.length;
    $console.append(getRespondLineInstance(newID));
    let $respondLine = $("#r" + newID);
    $respondLine.prop('readonly', true);
    $respondLine.val(text);

    $respondLine.css("height", countTextareaLine($respondLine.get(0)) * fontSize + "rem");
}

const addCurrentRequestLine = (text) => {
    $console.append(getRequestLineInstance(requestList.length));
    let $currRequestLine = $("#" + requestList.length);
    $currRequestLine.focus();
    $currRequestLine.val(text); 

    $currRequestLine.bind('input propertychange', (e) => {
        currentRequestText = $currRequestLine.val();
        chrome.storage.local.set({"currentRequestText": currentRequestText}, () => {});
        $currRequestLine.css("height", countTextareaLine(e.target) * fontSize + "rem");
    });
    $currRequestLine.keydown((e) => {
        if (e.which == 38) {
            e.preventDefault();
            if (!requestList.length) return; 
            currentRequestText = requestList[requestList.length - 1];
            chrome.storage.local.set({"currentRequestText": currentRequestText}, () => {});
            $currRequestLine.val(currentRequestText);
        }
    });
}

const archiveLastConsoleLine = () => {
    if (inClearConsoleProgress) {
        inClearConsoleProgress = false;
        return;
    }

    currentRequestText = "";
    let requestID = requestList.length;
    let $requestLine = $("#" + requestID);
    let lastRequest = $requestLine.val();
    $requestLine.blur();
    $requestLine.prop('readonly', true);
    requestList.push(lastRequest);
    requestLinesHeight.push(countTextareaLine($requestLine.get(0)) * fontSize);

    let respondID = respondList.length;
    let $respondLine = $("#r" + respondID);
    respondList.push($respondLine.val());
    respondLinesHeight.push(countTextareaLine($respondLine.get(0)) * fontSize);
}

const updateLastConsoleLineToStorage = async () => {
    archiveLastConsoleLine();
    await chrome.storage.local.set({
        "requestList": requestList, 
        "respondList": respondList,
        "requestLinesHeight": requestLinesHeight,
        "respondLinesHeight": respondLinesHeight,
        "currentRequestText": "",
        "autoClearConsoleLimit": autoClearConsoleLimit
    }, () => {});
}

$(document).on('keypress', async (e) => {
    if (e.which == 13) {
        e.preventDefault();
        await handleRequest();
        await updateLastConsoleLineToStorage();
        addNewRequestLine();
    }
});
