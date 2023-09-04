window.onload = async () => {
  const extensionOptions = await chrome.runtime.sendMessage({ target : "readCheckedFields" });
  if (extensionOptions.length > 0){
    extensionOptions.forEach(id => {
      document.getElementById(id).checked = true;
    })
  }
};
