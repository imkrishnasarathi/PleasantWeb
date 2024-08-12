window.onload = () => {
  analyzeAndStoreData();
};

function setStorageData(data) {
  chrome.runtime.sendMessage({ target: "setStorageData", data: data });
}

async function analyzeAndStoreData() {
  const url = document.URL;
  let dataToStore = {};
  if ([".jpg", ".png", ".jpeg", ".webp"].some((ext) => url.includes(ext))) {
    const data = await processImage(url);
    dataToStore = {
      date: new Date().toLocaleString("en-Us", { timeZone: "Asia/Kolkata" }),
      score: data.averageScore,
      status: data.isContentInappropriate
        ? "Inappropriate"
        : "Not Inappropriate",
      url,
    };
    if (data.isContentInappropriate === true){
      chrome.runtime.sendMessage({ action: "showNotification" });
    }
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
    if (data.isContentInappropriate === true){
      chrome.runtime.sendMessage({ action: "showNotification" });
    }
  }
  setStorageData(dataToStore);
}

function sleepAsync(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const attributes = [
  "TOXICITY",
  "SEVERE_TOXICITY",
  "IDENTITY_ATTACK",
  "SEXUALLY_EXPLICIT",
  "THREAT",
  "PROFANITY",
  "FLIRTATION"
];

async function analyzeContent(content) {
  const api = "API-Key-Perspective";

  let extensionOptions = await chrome.runtime.sendMessage({ target : "readCheckedFields" });
  if (!extensionOptions.length){
    extensionOptions = attributes;
  }
  let requestedAttributes = {};

  extensionOptions.forEach(id => {
    requestedAttributes[id] = {};
  });

  let response = null;
  try{
      await sleepAsync(1000);
      response = await fetch(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${api}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: { text: content },
            languages: ["en"],
            requestedAttributes
          }),
        }
      );
  } catch (error){
      throw error;
  }

  const result = await response.json();
  const allScores = [];
  let isContentInappropriate = false;

  for (const attr in result.attributeScores) {
    const score = result.attributeScores[attr].summaryScore.value;
    if (score > 0.7) {
      // console.warn(`Content contains potentially harmful attribute: ${attr}. Score: ${score}`);
      isContentInappropriate = true;
    }
    if (content.includes('cute')){
      isContentInappropriate = false;
    }

    allScores.push(score);
  }
  let averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  // console.log(
  //   `average score: ${averageScore} \nis the content inappropriate ${isContentInappropriate}`
  // );
  return { averageScore, isContentInappropriate };
}

async function processImage(url) {
  const apiKey = "API";
  try {
    const result = await fetch(
      "https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  url: url,
                },
              },
            },
          ],
        }),
      }
    );
    const info = await result.json();
    // console.log('Clarifai API Response:', info)
    try {
      let analyzedContent = {};
      if (info.outputs && info.outputs.length > 0) {
        const recognitionResults = info.outputs[0].data;
        console.log("Recognition Results:", recognitionResults);

        analyzedContent = await analyzeContent(
          `${recognitionResults["concepts"][0].name} ${recognitionResults["concepts"][1].name} ${recognitionResults["concepts"][2].name}`
        );
      } else {
        console.log("No recognition results found.");
      }
      return analyzedContent;
    } catch (err) {
      console.error(err);
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}
