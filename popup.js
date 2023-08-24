chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showPopup"){
        const overlay = document.querySelector('#overlay');
        const content = document.querySelector("#cnt");
        console.log(overlay)
        overlay.style.display = "block";
        content.style.display = "none";
    }
})