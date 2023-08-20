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

async function setTheme(info) {
    getTheme().then(storedData => {
          storedData = info;
          chrome.storage.local.set({ theme: JSON.stringify(storedData) });
        }).catch(error => {
          console.error(error);
        });
}

async function getTheme(){
    try{
      const data = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["theme"], function (result) {
          resolve(JSON.parse(result.theme || "[]"));
        });
      })
      return data;
    }
    catch (error){
      console.error(error);
      return [];
    }
}

function setStorageData(data) {
    getStorageData().then(storedData => {
      storedData.push(data);
      chrome.storage.local.set({ pw: JSON.stringify(storedData) });
    }).catch(error => {
      console.error(error);
    });
}

async function getStorageData() {
    try {
      const data = await new Promise((resolve, reject) => {
        chrome.storage.local.get(["pw"], function (result) {
          resolve(JSON.parse(result.pw || "[]"));
        });
      });
      return data;
    } catch (error) {
      console.error("Error while retrieving data from local storage:", error);
      return [];
    }
}