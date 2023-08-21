const blockCurrentWebsite = () => {
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        let url = new URL(tabs[0].url).hostname;
        if (blockWebsite.includes(url)) {
            addNewRespondLine("This domain has been blocked before");
            return;
        }

        blockWebsite.push(url);
        console.log(blockWebsite);
        chrome.storage.local.set({"blockWebsite": blockWebsite}, () => {
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[{
                    "id": blockWebsite.length + 1,
                    "priority": 1,
                    "action": {"type": "block"},
                    "condition": {"urlFilter": url, "resourceTypes": ["main_frame"]}}
                ],
                removeRuleIds: [blockWebsite.length + 1],
            }, () => {
                chrome.tabs.reload(tabs[0].id);
            })    
        });
        addNewRespondLine("Block success !!");
    });
}

const showBlockWebsite = () => {
    if (!blockWebsite.length) {
        addNewRespondLine("U haven't blocked anything yet");
        return;
    }

    let respondText = "";
    for (let i = 0; i < blockWebsite.length; i ++) {
        respondText += (i + 1) + ". " + blockWebsite[i];
        if (i + 1 < blockWebsite.length) respondText += '\n';
    }
    addNewRespondLine(respondText);
} 

const unblockAllWebsite = () => {
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
        const previousRuleIds = previousRules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});
    });
    addNewRespondLine("Unblock all website");
}