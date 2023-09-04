window.onload = async () => {
  const extensionOptions = await chrome.runtime.sendMessage({ target : "readCheckedFields" });
  if (extensionOptions.length > 0){
    extensionOptions.forEach(id => {
      document.getElementById(id).checked = true;
    })
  }
};

function getAndSendCheckedFields() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedFields = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedFields.push(checkbox.id);
    }
  });
  chrome.runtime.sendMessage({
    target: "updateCheckedFields",
    checkedFields,
  }).then(data => {}).catch(err => {  
    console.log(err);
  })
}

