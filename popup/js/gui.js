let fontSize = 1.2;

const countLines = (textarea) => {
    let _buffer;
    if (_buffer == null) {
        _buffer = document.createElement('textarea');
        _buffer.style.border = 'none';
        _buffer.style.height = '0';
        _buffer.style.overflow = 'hidden';
        _buffer.style.padding = '0';
        _buffer.style.position = 'absolute';
        _buffer.style.left = '0';
        _buffer.style.top = '0';
        _buffer.style.zIndex = '-1';
        document.body.appendChild(_buffer);
    }

    let cs = window.getComputedStyle(textarea);
    let pl = parseInt(cs.paddingLeft);
    let pr = parseInt(cs.paddingRight);
    let lh = parseInt(cs.lineHeight);

    if (isNaN(lh)) lh = parseInt(cs.fontSize);

    _buffer.style.width = (textarea.clientWidth - pl - pr) + 'px';

    _buffer.style.font = cs.font;
    _buffer.style.letterSpacing = cs.letterSpacing;
    _buffer.style.whiteSpace = cs.whiteSpace;
    _buffer.style.wordBreak = cs.wordBreak;
    _buffer.style.wordSpacing = cs.wordSpacing;

    _buffer.value = textarea.value;

    let result = Math.floor(_buffer.scrollHeight / lh);
    if (result == 0) result = 1;
    return result;
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
    chrome.storage.sync.set({"requestList": requestList, "respondList": {}}, () => {});
}

const addOldRequestLine = (id, text) => {
    $console.append(createRequestLine(id));
    let inputObject = $("#" + id);
    inputObject.prop('readonly', true);
    inputObject.text(text);
    console.log(id + " " + countLines(inputObject.get(0)));
    inputObject.css("height", countLines(inputObject.get(0)) * fontSize + "rem");
}

const addNewRequestLine = () => {
    let newID = requestList.length;
    $console.append(createRequestLine(newID));
    let newInputObject = $("#" + newID);
    
    setTimeout(() => {newInputObject.focus();});
    newInputObject.bind('input propertychange', (e) => {
        newInputObject.css("height", countLines(e.target) * fontSize + "rem");
    });
}

const addCurrentRequestLine = () => {
    $console.append(createRequestLine(requestList.length));
    let currInputObject = $("#" + requestList.length);
    setTimeout(() => {currInputObject.focus();});
    currInputObject.bind('input propertychange', (e) => {
        currInputObject.css("height", countLines(e.target) * fontSize + "rem");
    });
}

const buildOldGUI = () => { 
    for (let i = 0; i < requestList.length; i ++)
        addOldRequestLine(i, requestList[i]);
}