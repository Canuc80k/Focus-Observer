const blockCurrentWebsite = () => {
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        let url = new URL(tabs[0].url).hostname;

        chrome.declarativeNetRequest.updateDynamicRules({
            addRules:[{
                "id": blockWebsite.length + 1,
                "priority": 1,
                "action": {"type": "block"},
                "condition": {"urlFilter": url, "resourceTypes": ["main_frame"]}}
            ],
            removeRuleIds: [blockWebsite.length + 1],
        }, () => {
            blockWebsite.push(url);
            chrome.storage.local.set({"blockWebsite": {}}, () => {});
            chrome.tabs.reload(tabs[0].id);
        })    
    });
    
    addNewRespondLine("Block success !!");
}

const unblockAllWebsite = () => {
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
        const previousRuleIds = previousRules.map(rule => rule.id);
        chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});
    });
    addNewRespondLine("Unblock all website");
}