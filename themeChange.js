//responsible for changing the theme of the page
function setTheme() {
  const root = document.documentElement;
  const newTheme = root.className === "dark" ? "light" : "dark";
  root.className = newTheme;

  const themeToggle = document.querySelector(".theme-toggle");
  const isThemeChecked = themeToggle.checked;

  chrome.storage.local.set(
    { theme: newTheme, themeChecked: isThemeChecked },
    function () {
      console.log("Theme and state saved:", newTheme, isThemeChecked);
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["theme", "themeChecked"], function (data) {
    const savedTheme = data.theme;
    const savedThemeChecked = data.themeChecked;
    if (savedTheme) {
      const root = document.documentElement;
      root.className = savedTheme;

      const themeToggle = document.querySelector(".theme-toggle");
      themeToggle.checked = savedThemeChecked;
    }
  });

  document.querySelector(".theme-toggle").addEventListener("click", setTheme);
});
