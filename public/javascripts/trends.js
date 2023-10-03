const dateSelected = document.querySelector("#date");

dateSelected.addEventListener("input", (e) => {
  let regionSelected = document.querySelector("#region");
  let results = document.querySelector("#content");
  results.innerHTML = "<div class='loader'></div>";
  window.location.href =
    "/trends/" +
    e.target.value +
    "?geo=" +
    regionSelected.getAttribute("value");
});
