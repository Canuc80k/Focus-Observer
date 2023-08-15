const getConsole = () => {
    let console = {};
    chrome.storage.sync.get().then((data) => {
        console = data.console;
    });
    return console;
}

const setConsole = (console) => { 
    chrome.storage.sync.set({"console": console}, () => {});
}