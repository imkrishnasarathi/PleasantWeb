//Listen for messages from the content script and perform actions with the local storage.

chrome.runtime.onMessage.addListener((message, sender,sendResponse)=> {
    console.log("Message received in background.js:", message);
    const target = message.target;
    switch (target) {
        case "setStorageData":
          setStorageData(message.data);
          break;
        case "getStorageData":
          getStorageData().then(returnData => {
            console.log("Sending data from background.js:", returnData);
            sendResponse(returnData);
          }).catch(error => {
            console.error(error);
            sendResponse([]);
          });
          break;
        case "setTheme":
          setTheme(message.theme)
      }
      return true;
})