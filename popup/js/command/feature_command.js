const blockCurrentWebsite = () => {
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
        let url = tabs[0].url;

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