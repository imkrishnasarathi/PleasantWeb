//responsible for changing the theme of the page
function setTheme() {
    const root = document.documentElement;
    const newTheme = root.className === 'dark' ? 'light' : 'dark';
    root.className = newTheme;
  
    const themeToggle = document.querySelector('.theme-toggle');
    const isThemeChecked = themeToggle.checked;
  
    chrome.storage.local.set({ theme: newTheme, themeChecked: isThemeChecked }, function() {
      console.log('Theme and state saved:', newTheme, isThemeChecked);
    });
  }
