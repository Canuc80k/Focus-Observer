const blockCurrentWebsite = async () => {
    const tabData = await chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT});
    console.log(tabData[0].url);
    let domain = new URL(tabData[0].url).hostname;
    
    if (blockWebsite.includes(domain)) {
        addNewRespondLine("This domain has been blocked before");
        return;
    }
    
    blockWebsite.push(domain);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules:[{
                "id": blockWebsite.length + 1,
                "priority": 1,
                "action": {"type": "block"},
                "condition": {"urlFilter": domain, "resourceTypes": ["main_frame"]}}
        ],
        removeRuleIds: [blockWebsite.length + 1],
    });

    await chrome.tabs.reload();
      
    addNewRespondLine("Block success !!");
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

const unblockAllWebsite = async () => {
    let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
    const previousRuleIds = previousRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});
    blockWebsite = [];
    await chrome.storage.local.set({"blockWebsite": blockWebsite});

    addNewRespondLine("Unblock all website");
}