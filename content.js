function setStorageData(data) {
    chrome.runtime.sendMessage({ target: "setStorageData", data: data });
}