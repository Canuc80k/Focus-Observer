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
    return "<div class=\"console-line\"><textarea class=\"console-text\">respond :D</textarea></div>";
}

const archiveCurrentLine = () => {
    let currID = requestList.length;
    let currInputObject = $("#" + currID);
    
    currInputObject.blur();
    currInputObject.prop('readonly', true);
    requestList.push(currInputObject.val());
    requestLinesHeight.push(countTextareaLine(currInputObject.get(0)) * fontSize);
    chrome.storage.sync.set({
        "requestList": requestList, 
        "respondList": respondList,
        "requestLinesHeight": requestLinesHeight,
        "respondLinesHeight": respondLinesHeight,
    }, () => {});
}

const addOldRequestLine = (id, text, height) => {
    $console.append(createRequestLine(id));
    let inputObject = $("#" + id);
    inputObject.prop('readonly', true);
    inputObject.text(text);
    console.log(id + " " + countTextareaLine(inputObject.get(0)));
    inputObject.css("height", height + "rem");
}

const addNewRequestLine = () => {
    let newID = requestList.length;
    $console.append(createRequestLine(newID));
    let newInputObject = $("#" + newID);
    
    setTimeout(() => {newInputObject.focus();});
    newInputObject.bind('input propertychange', (e) => {
        newInputObject.css("height", countTextareaLine(e.target) * fontSize + "rem");
    });
}

const addCurrentRequestLine = () => {
    $console.append(createRequestLine(requestList.length));
    let currInputObject = $("#" + requestList.length);
    setTimeout(() => {currInputObject.focus();});
    currInputObject.bind('input propertychange', (e) => {
        currInputObject.css("height", countTextareaLine(e.target) * fontSize + "rem");
    });
}

const buildOldGUI = () => { 
    for (let i = 0; i < requestList.length; i ++)
        addOldRequestLine(i, requestList[i], requestLinesHeight[i]);
}