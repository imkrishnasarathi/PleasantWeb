//Listen for messages from the content script and perform actions with the local storage.

chrome.runtime.onMessage.addListener((message, sender,sendResponse)=> {
    console.log("Message received in background.js:", message);
})