function toggleClass(el) {
  const choices = document.getElementsByClassName("link");
  for (let i = 0; i < choices.length; i++) {
      choices[i].classList.remove("active");
  }
  el.classList.add("active");
}