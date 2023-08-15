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

async function analyzeContent(content){
    const api = "AIzaSyCHjwjNwyaa-GXk3dU_lCbvta36TDkxImg";

    const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment: { text:content },
      languages: ['en'], 
      requestedAttributes: {
        TOXICITY: {},
        SEVERE_TOXICITY: {},
        IDENTITY_ATTACK: {},
        SEXUALLY_EXPLICIT: {},
        THREAT: {},
        PROFANITY: {},
        FLIRTATION: {},
      },
    }),
  });

  const result = await response.json();
  const allScores = [];
  let isContentInappropriate = false;

  for (const attr in result.attributeScores) {
    const score = result.attributeScores[attr].summaryScore.value;
    if (score > 0.45) {
    // console.warn(`Content contains potentially harmful attribute: ${attr}. Score: ${score}`);
      isContentInappropriate = true;
    }
    allScores.push(score);
  }
  let averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  return { averageScore, isContentInappropriate };
}