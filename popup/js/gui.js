let fontSize = 1.2;

const countTextareaLine = (textarea) => {
    let cs = window.getComputedStyle(textarea);
    let lh = parseInt(cs.lineHeight);
    if (isNaN(lh)) lh = parseInt(cs.fontSize);
    
    let res = Math.floor(textarea.scrollHeight / lh);
    if (res == 0) res = 1;
    return res;
}

const createRequestLine = (id) => {
    return "<div class=\"console-line\"><div class=\"console-begin-char\">&gt;&nbsp;&nbsp;</div><textarea id=\"" + id + "\" class=\"console-text\"></textarea></div>";
}

const createRespondLine = (id) => {
    return "<div class=\"console-line\"><textarea id=\"r" + id + "\" class=\"respond-console-text\" readonly=\"true\"></textarea></div>";
}

const archiveCurrentLine = () => {
    if (!isAlreadyClearConsole) {
        let currID = requestList.length;
        let $requestLine = $("#" + currID);

        $requestLine.blur();
        $requestLine.prop('readonly', true);
        requestList.push($requestLine.val());
        requestLinesHeight.push(countTextareaLine($requestLine.get(0)) * fontSize);

        let currRID = respondList.length;
        let $respondLine = $("#r" + currRID);
        respondList.push($respondLine.val());
        respondLinesHeight.push(countTextareaLine($respondLine.get(0)) * fontSize);
    }
    isAlreadyClearConsole = false;

    chrome.storage.sync.set({
        "requestList": requestList, 
        "respondList": respondList,
        "requestLinesHeight": requestLinesHeight,
        "respondLinesHeight": respondLinesHeight,
        "currentRequestText": ""
    }, () => {});
}

const addOldRequestLine = (id, text, height) => {
    $console.append(createRequestLine(id));
    let $resquestLine = $("#" + id);
    $resquestLine.prop('readonly', true);
    $resquestLine.text(text);
    $resquestLine.css("height", height + "rem");
}

const addOldRespondLine = (id, text, height) => {
    $console.append(createRespondLine(id));
    let $respondLine = $("#r" + id);
    $respondLine.text(text);
    $respondLine.css("height", height + "rem");
}

const addNewRequestLine = () => {
    let newID = requestList.length;
    $console.append(createRequestLine(newID));
    let $requestLine = $("#" + newID);
    
    setTimeout(() => {$requestLine.focus();});
    $requestLine.bind('input propertychange', (e) => {
        $requestLine.css("height", countTextareaLine(e.target) * fontSize + "rem");
       
        currentRequestText = $requestLine.val();
        chrome.storage.sync.set({"currentRequestText": currentRequestText}, () => {});
    });
}

const addNewRespondLine = (text) => {
    let newID = respondList.length;
    $console.append(createRespondLine(newID));
    let $respondLine = $("#r" + newID);
    $respondLine.prop('readonly', true);
    $respondLine.val(text);

    $respondLine.css("height", countTextareaLine($respondLine.get(0)) * fontSize + "rem");
}

const addCurrentRequestLine = (text) => {
    $console.append(createRequestLine(requestList.length));
    let $currRequestLine = $("#" + requestList.length);
    setTimeout(() => {$currRequestLine.focus();});
    $currRequestLine.val(text); 

    $currRequestLine.bind('input propertychange', (e) => {
        currentRequestText = $currRequestLine.val();
        chrome.storage.sync.set({"currentRequestText": currentRequestText}, () => {});

        $currRequestLine.css("height", countTextareaLine(e.target) * fontSize + "rem");
    });
}

const buildOldGUI = () => { 
    for (let i = 0; i < requestList.length; i ++) {
        addOldRequestLine(i, requestList[i], requestLinesHeight[i]);
        addOldRespondLine(i, respondList[i], respondLinesHeight[i]);
    }
}

$(document).on('keypress', (e) => {
    if (e.which == 13) {
        handleCommand();
        archiveCurrentLine();
        addNewRequestLine();
    }
});