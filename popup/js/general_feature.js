const addJumpToPreviousRequestLineEvent = () => {
    let id = requestList.length;
    let $requestLine = $("#" + id);
    
    $requestLine.keydown((e) => {
        if (e.which == 38) {
            e.preventDefault();
            if (!requestList.length) return;
            if (requestLinePointer == 0) return;

            let prevID = requestLinePointer - 1;
            if (requestLinePointer == -1) prevID = requestList.length - 1;
            requestLinePointer = prevID;

            currentRequestText = requestList[prevID];
            chrome.storage.local.set({"currentRequestText": currentRequestText}, () => {});
            $requestLine.val(currentRequestText);
        }
    });
}