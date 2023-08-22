const showBlockCommand = () => {
    let respond = "* block -c\n-> block current website\n\n";
    respond += "* block -s\n-> show all blocked website\n\n";
    respond += "* block X\n-> block domain X, eg: block facebook.com";
    addNewRespondLine(respond);
}

const blockSpecificWebsite = async (domain) => {
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

    addNewRespondLine("Block success !!");
} 

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

const isPositiveNumber = (value) => {
    return /^\d+$/.test(value);
}

const unblockSpecificWebsite = async (rawData) => {
    if (isPositiveNumber(rawData)) {
        if (rawData - 1 >= blockWebsite.length) {
            addNewRespondLine("Blocked website with index " + rawData + " doesn't exit");
            return;
        }
        
        const id = rawData - 1; 
        blockWebsite.splice(id, 1);
        await chrome.storage.local.set({"blockWebsite": blockWebsite});
        
        let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
        const previousRuleIds = previousRules.map(rule => rule.id);
        await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});

        for (let i = 0; i < blockWebsite.length; i ++)
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[{
                    "id": i + 1,
                    "priority": 1,
                    "action": {"type": "block"},
                    "condition": {"urlFilter": blockWebsite[i], "resourceTypes": ["main_frame"]}}
                ],
                removeRuleIds: [i + 1],
            });

        addNewRespondLine("Unblock website with index " + rawData + " successfully");
        return;
    }

    if (!blockWebsite.includes(rawData)) {
        addNewRespondLine(rawData + " isn't in your block website list");
        return;
    }

    blockWebsite = blockWebsite.filter(x => x !== rawData);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
        
    let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
    const previousRuleIds = previousRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});

    for (let i = 0; i < blockWebsite.length; i ++)
        await chrome.declarativeNetRequest.updateDynamicRules({
            addRules:[{
                "id": i + 1,
                "priority": 1,
                "action": {"type": "block"},
                "condition": {"urlFilter": blockWebsite[i], "resourceTypes": ["main_frame"]}}
            ],
            removeRuleIds: [i + 1],
        });

    addNewRespondLine("Unblock website " + rawData + " successfully");
}

const unblockAllWebsite = async () => {
    let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
    const previousRuleIds = previousRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});
    blockWebsite = [];
    await chrome.storage.local.set({"blockWebsite": blockWebsite});

    addNewRespondLine("Unblock all website");
}

const showReloadCommands = () => {
    let respond = "* reload -c\n-> reload current website\n\n";
    respond += "* reload -b\n-> reload all blocked website & url in tabs\n\n";
    respond += "* reload -a\n-> reload all tabs";
    addNewRespondLine(respond);
}

const reloadCurrentPage = async () => {
    await chrome.tabs.reload();
    addNewRespondLine("Page reloaded");
}

const reloadBlockPage = async () => {
    const tabData = await chrome.tabs.query({});
    for (let i = 0; i < tabData.length; i ++) {
        console.log(new URL(tabData[i].url).hostname.toString());
        if (blockWebsite.includes(new URL(tabData[0].url).hostname.toString()) || blockUrl.includes(tabData[0].url).toString()) 
            await chrome.tabs.reload(tabData[i].id);
    }

    addNewRespondLine("Blocked page reloaded");
}

const reloadAllPage = async () => {
    const tabData = await chrome.tabs.query({});
    for (let i = 0; i < tabData.length; i ++) 
        await chrome.tabs.reload(tabData[i].id);
    
    addNewRespondLine("All page reloaded");
}