const explore = document.querySelector("#search");

// Initial explore input value
const query = window.location.search.split("&q=")[1];
if (Boolean(query)) explore.value = decodeURI(query);

explore.addEventListener("keypress", (e) => {
  let regionSelected = document.querySelector("#region");
  let results = document.querySelector("#results");

  if (e.target.value != "" && e.keyCode == 13) {
    results.innerHTML = "<div class='loader'></div>";
    window.location.href =
      "/search?geo=" +
      regionSelected.getAttribute("value") +
      "&q=" +
      e.target.value;
    e.preventDefault();
  } else if (e.keyCode == 13) {
    e.preventDefault();
  }
});

// Header scroll down to hide
let prevScrollpos = $(window).scrollTop();
$(window).scroll(() => {
  let currentScrollPos = $(window).scrollTop();
  if (prevScrollpos >= currentScrollPos || currentScrollPos <= 20) {
    $(".header").css("top", "0");
  } else {
    $(".header").css("top", "-20vh");
  }
  prevScrollpos = currentScrollPos;
});
