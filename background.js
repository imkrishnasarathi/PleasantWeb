//Listen for messages from the content script and perform actions with the local storage.

chrome.runtime.onMessage.addListener((message, sender,sendResponse)=> {
    console.log("Message received in background.js:", message);
    const target = message?.target || null;
    if (message.action === "showNotification") {
      console.log("Received showNotification message");
      chrome.notifications.create({
        type: "basic",
        title: "PleasantWeb - Inappropriate content detected. 🚨",
        message: "The content detected in the current page may be inappropriate. Proceed at your own risk.",
        iconUrl: "assets/Logo128.png"
      });
    }
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
          break;
        case "updateCheckedFields":
          chrome.storage.local.set({ pwExtensionOptions : JSON.stringify(message.checkedFields) });
          break;
        case "readCheckedFields":
          getExtensionOptions().then(extensionOptions => {
            sendResponse(extensionOptions);
          });
          
          break;

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

async function getExtensionOptions() {
  try {
    const data = await new Promise((resolve, reject) => {
      chrome.storage.local.get(["pwExtensionOptions"], function (result) {
        resolve(JSON.parse(result.pwExtensionOptions || "[]"));
      });
    });
    return data;
  } catch (error) {
      console.error("Error while retrieving data from local storage:", error);
      return [];
  }
}