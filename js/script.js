window.addEventListener('scroll', function() {
  const menu = document.getElementById('menu');
  

  if (window.scrollY > 50) {
    menu.classList.add('scrolled');
  } else {
    menu.classList.remove('scrolled');
  }
});