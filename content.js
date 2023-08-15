function setStorageData(data) {
  chrome.runtime.sendMessage({ target: "setStorageData", data: data });
}

async function analyzeAndStoreData() {
  const url = document.URL;
  let dataToStore = {};
  if (["jpg", "png", ".jpeg", ".webp"].some((ext) => url.includes(ext))) {
    const data = await processImage(url);
    dataToStore = {
      date: new Date().toLocaleString("en-Us", { timeZone: "Asia/Kolkata" }),
      score: data.averageScore,
      status: data.isContentInappropriate
        ? "Inappropriate"
        : "Not Inappropriate",
      url,
    };
  } else {
    const content = document.body.innerText;
    const data = await analyzeContent(content);
    dataToStore = {
      date: new Date().toLocaleString("en-Us", { timeZone: "Asia/Kolkata" }),
      score: data.averageScore,
      status: data.isContentInappropriate
        ? "Inappropriate"
        : "Not Inappropriate",
      url,
    };
  }
  setStorageData(dataToStore);
}
