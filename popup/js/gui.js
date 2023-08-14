let fontSize = 1.2;

let _buffer;
const countLines = (textarea) => {
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

    var cs = window.getComputedStyle(textarea);
    var pl = parseInt(cs.paddingLeft);
    var pr = parseInt(cs.paddingRight);
    var lh = parseInt(cs.lineHeight);

    if (isNaN(lh)) lh = parseInt(cs.fontSize);

    _buffer.style.width = (textarea.clientWidth - pl - pr) + 'px';

    _buffer.style.font = cs.font;
    _buffer.style.letterSpacing = cs.letterSpacing;
    _buffer.style.whiteSpace = cs.whiteSpace;
    _buffer.style.wordBreak = cs.wordBreak;
    _buffer.style.wordSpacing = cs.wordSpacing;
    _buffer.style.wordWrap = cs.wordWrap;

    _buffer.value = textarea.value;

    var result = Math.floor(_buffer.scrollHeight / lh);
    if (result == 0) result = 1;
    return result;
}

let currID = 0;
let currRespondID = 0;

let createConsoleLineElement = (id) => {
    return "<div class=\"console-line\"><div class=\"console-begin-char\">&gt;&nbsp;&nbsp;</div><textarea id=\"" + id + "\" class=\"console-text\"></textarea></div>";
}

let createRespondConsoleLineElement = (id) => {
    return "<div class=\"console-line\"><textarea class=\"console-text\">respond :D</textarea></div>";
}

window.onload = (() => {
    $("#console").append(createConsoleLineElement(currID));
    setTimeout(() => {$("#" + currID).focus();});
    $("#" + currID).bind('input propertychange', (e) => {
        $("#" + currID).css("height", countLines(e.target) * fontSize + "rem");
    });
});