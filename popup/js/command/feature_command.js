const BROKEN_URL = "!";

const fixUrl = (url) => {
    const dots = url.split(".").length - 1; 
    if (dots == 0) return BROKEN_URL;
    return url;
}

const showBlockCommand = () => {
    let respond = "* block -c: block current website\n\n";
    respond += "* block -s: show all blocked websites\n\n";
    respond += "* block X: block domain X, eg: block facebook.com";
    addNewRespondLine(respond);
}

const addBlockRule = async (id, domain) => {
    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules:[{
                "id": id,
                "priority": 1,
                "action": {"type": "block"},
                "condition": {"regexFilter": "^(http:\/\/|https:\/\/)?([a-z0-9]+\.)*" + domain, "resourceTypes": ["main_frame"]}}
        ],
        removeRuleIds: [id],
    });
}

const blockSpecificWebsite = async (domain) => {
    let _domain = domain;
    domain = fixUrl(domain);
    if (domain === BROKEN_URL) {
        addNewRespondLine(_domain + " isn't valid");
        return;
    }

    if (blockWebsite.includes(domain)) {
        addNewRespondLine("This domain has been blocked before");
        return;
    }
    
    blockWebsite.push(domain);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
    await addBlockRule(blockWebsite.length + 1, domain);

    addNewRespondLine("Block success !!");
} 

const blockCurrentWebsite = async () => {
    const tabData = await chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT});
    let _domain = new URL(tabData[0].url).hostname;
    let domain = fixUrl(_domain);
    if (domain === BROKEN_URL) {
        addNewRespondLine(_domain + " isn't valid");
        return;
    }

    if (blockWebsite.includes(domain)) {
        addNewRespondLine("This domain has been blocked before");
        return;
    }
    
    blockWebsite.push(domain);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
    await addBlockRule(blockWebsite.length + 1, domain);

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

const showUnblockCommand = () => {
    let respond = "* unblock -s: show all blocked websites \n\n";
    respond += "* unblock -c: unblock current website\n\n";
    respond += "* unblock -a: unblock all websites\n\n";
    respond += "* unblock X: unblock domain X, eg: unblock fb.com\n\n";
    respond += "* unblock ID: unblock domain has index ID in blocked website list, eg: unblock 1";
    addNewRespondLine(respond);
}

const unblockCurrentWebsite = async () => {
    const tabData = await chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT});
    let url = new URL(tabData[0].url).hostname;
    url = fixUrl(url);

    let wwwUrl = "www." + url;
    let nonwwwUrl = url.slice(4);

    let inBlockWebsite = 0;
    if (blockWebsite.includes(url)) inBlockWebsite = 1;
    if (url.substring(0, 4) !== "www." && blockWebsite.includes(wwwUrl)) inBlockWebsite = 2;
    if (url.length >= 4 && url.substring(0, 4) === "www." && blockWebsite.includes(nonwwwUrl)) inBlockWebsite = 3;

    if (inBlockWebsite == 0) {
        addNewRespondLine(url + " isn't in your block website list");
        return;
    }

    if (inBlockWebsite == 2) url = wwwUrl;
    if (inBlockWebsite == 3) url = nonwwwUrl;
     
    await unblockWebsiteByDomain(url);
    await chrome.tabs.reload();
    addNewRespondLine("Unblock website " + url + " successfully");
}

const isPositiveNumber = (value) => {
    return /^\d+$/.test(value);
}

const unblockWebsiteByIndex = async (id) => {
    blockWebsite.splice(id, 1);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
    
    let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
    const previousRuleIds = previousRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});

    for (let i = 0; i < blockWebsite.length; i ++)
        await addBlockRule(i + 1, blockWebsite[i]);
}

const unblockWebsiteByDomain = async (domain) => {
    blockWebsite = blockWebsite.filter(x => x !== domain);
    await chrome.storage.local.set({"blockWebsite": blockWebsite});
        
    let previousRules = await chrome.declarativeNetRequest.getDynamicRules();
    const previousRuleIds = previousRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: previousRuleIds});

    for (let i = 0; i < blockWebsite.length; i ++)
        await addBlockRule(i + 1, blockWebsite[i]);
}

const unblockSpecificWebsite = async (rawData) => {
    if (isPositiveNumber(rawData)) {
        if (rawData - 1 >= blockWebsite.length) {
            addNewRespondLine("Blocked website with index " + rawData + " doesn't exit");
            return;
        }

        unblockWebsiteByIndex(rawData - 1);
        addNewRespondLine("Unblock website with index " + rawData + " successfully");
        return;
    }

    let url = fixUrl(rawData);
    if (url === BROKEN_URL) {
        addNewRespondLine(rawData + " isn't valid");
        return;
    }
    let wwwUrl = "www." + url;
    let nonwwwUrl = url.slice(4);

    let inBlockWebsite = 0;
    if (blockWebsite.includes(url)) inBlockWebsite = 1;
    if (url.substring(0, 4) !== "www." && blockWebsite.includes(wwwUrl)) inBlockWebsite = 2;
    if (url.length >= 4 && url.substring(0, 4) === "www." && blockWebsite.includes(nonwwwUrl)) inBlockWebsite = 3;

    if (inBlockWebsite == 0) {
        addNewRespondLine(rawData + " isn't in your block website list");
        return;
    }

    if (inBlockWebsite == 2) url = wwwUrl;
    if (inBlockWebsite == 3) url = nonwwwUrl;
     
    await unblockWebsiteByDomain(url);
    addNewRespondLine("Unblock website " + url + " successfully");
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
    let respond = "* reload -c: reload current website\n\n";
    respond += "* reload -b: reload all tabs & urls which blocked\n\n";
    respond += "* reload -a: reload all tabs";
    addNewRespondLine(respond);
}

const reloadCurrentPage = async () => {
    await chrome.tabs.reload();
    addNewRespondLine("Page reloaded");
}

const reloadBlockPage = async () => {
    const tabData = await chrome.tabs.query({});
    for (let i = 0; i < tabData.length; i ++) {
        let url = new URL(tabData[i].url).hostname.toString();
        let wwwUrl = "www." + url; 
        let nonwwwUrl = url.slice(4);

        console.log(url + " " + wwwUrl + " " + nonwwwUrl);
        if (blockWebsite.includes(url) 
            || (url.substring(0, 4) !== "www." && blockWebsite.includes(wwwUrl))
            || (url.length >= 4 && url.substring(0, 4) === "www." && blockWebsite.includes(nonwwwUrl))
            || blockUrl.includes(url)
            || (url.substring(0, 4) !== "www." && blockUrl.includes(wwwUrl))
            || (url.length >= 4 && url.substring(0, 4) === "www." && blockUrl.includes(nonwwwUrl))
        ) await chrome.tabs.reload(tabData[i].id);
    }

    addNewRespondLine("Blocked page reloaded");
}

const reloadAllPage = async () => {
    const tabData = await chrome.tabs.query({});
    for (let i = 0; i < tabData.length; i ++) 
        await chrome.tabs.reload(tabData[i].id);
    
    addNewRespondLine("All page reloaded");
}