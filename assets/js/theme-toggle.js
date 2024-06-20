/* assets/js/theme-toggle.js */

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.classList.add(currentTheme);

    toggleButton.addEventListener('click', function() {
      const newTheme = document.body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(newTheme);
      document.getElementsByClassName('trigger')[0].classList.remove('light-mode', 'dark-mode');
      document.getElementsByClassName('trigger')[0].classList.add(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });
