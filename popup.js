document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById("overlay");
    const openSecondaryPopupButton = document.getElementById("openSecondaryPopup");
    const closeSecondaryPopupButton = document.getElementById("closeSecondaryPopup");
    
    openSecondaryPopupButton.addEventListener("click", function() {
      overlay.style.display = "block";
    });
  
    closeSecondaryPopupButton.addEventListener("click", function() {
      overlay.style.display = "none";
    });
  
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.showSecondaryPopup) {
        overlay.style.display = "block";
      } else if (message.hideSecondaryPopup) {
        overlay.style.display = "none";
      }
    });
  });
  