const dateSelected = document.querySelector("#date");

dateSelected.addEventListener("input", (e) => {
  let regionSelected = document.querySelector("#region");
  let content = document.querySelector("#content");
  content.innerHTML = "<div class='loader'></div>";
  window.location.href =
    "/trends/" +
    e.target.value +
    "?geo=" +
    regionSelected.getAttribute("value");
});
