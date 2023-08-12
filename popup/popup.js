let currID = 0;

let createConsoleLineElement = (id) => {
    let result = "<div class=\"console-line\">";
    result += "<div class=\"console-begin-char\">&gt; </div>"
    result += "<input id=\"" + id + "\" class=\"console-text\" type=\"text\"></input>";
    result += "</div>"

    return result;
}

window.onload = (() => {
    $("#console").append(createConsoleLineElement(currID));
    $("#" + currID).focus();
});

$(document).on('keypress', (e) => {
    if(e.which == 13) {
        $("#" + currID).blur();
        $("#console").append(createConsoleLineElement(++ currID));
        $("#" + currID).focus();

        console.log($('body').height());
    }
});
