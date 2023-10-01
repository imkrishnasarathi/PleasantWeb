function toggleTheme() {
  const htmlElement = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");

  if (themeToggle.checked) {
    htmlElement.classList.remove("light");
    htmlElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.classList.remove("dark");
    htmlElement.classList.add("light");
    localStorage.setItem("theme", "light");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme");
  const themeToggle = document.querySelector(".theme-toggle");

  if (savedTheme === "dark") {
    themeToggle.checked = true;
    toggleTheme(); 
  } else {
    themeToggle.checked = false;
  }

  themeToggle.addEventListener("change", toggleTheme);
});
