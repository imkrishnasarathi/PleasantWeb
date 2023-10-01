// Function to toggle the theme
function toggleTheme() {
  const htmlElement = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle.checked) {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
  }

  // Save the theme preference in local storage
  const isDarkMode = htmlElement.classList.contains("dark");
  localStorage.setItem("darkMode", isDarkMode);
}

document.addEventListener("DOMContentLoaded", function () {
  // Check the user's theme preference from local storage
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const themeToggle = document.querySelector(".theme-toggle");
  themeToggle.checked = isDarkMode;

  // Add event listener to the theme toggle switch
  themeToggle.addEventListener("change", toggleTheme);
});
