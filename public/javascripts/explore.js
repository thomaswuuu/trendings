const explore = document.querySelector("#explore");

// Initial explore input value
const query = window.location.search.split("&q=")[1];
if (Boolean(query)) explore.value = decodeURI(query);

explore.addEventListener("keypress", (e) => {
  let regionSelected = document.querySelector("#region");
  let results = document.querySelector("#results");

  if (e.target.value != "" && e.keyCode == 13) {
    results.innerHTML = "<div class='loader'></div>";
    window.location.href =
      "/explore?geo=" +
      regionSelected.getAttribute("value") +
      "&q=" +
      e.target.value;
    e.preventDefault();
  } else if (e.keyCode == 13) {
    e.preventDefault();
  }
});

// Previous and next page click listeners
function previous(listId, pageId, data) {
  let list = document.querySelector(listId);
  let page = document.querySelector(pageId);
  let currentPage = parseInt(page.dataset.page) - 1;
  if (currentPage != 0) {
    let numberPage = 5;
    let remainder = data.length % numberPage;
    let totalPage = data.length / numberPage;
    if (remainder > 0) totalPage++;
    let initialIndex = (currentPage - 1) * numberPage;
    let limit = currentPage * numberPage;
    let content = "";
    for (let i = initialIndex; i < limit; i++) {
      content += `<div><span class="rank">${data[i].index}</span><a href="https://www.google.com/search?q=${data[i].query}" target="_blank">
      <span>${data[i].query}</span></a></div>`;
    }
    list.innerHTML = content;
    page.dataset.page = currentPage;
    page.innerHTML = `${currentPage}  /  ${totalPage}`;
  }
}
function next(listId, pageId, data) {
  let list = document.querySelector(listId);
  let page = document.querySelector(pageId);
  let currentPage = parseInt(page.dataset.page) + 1;
  let numberPage = 5;
  let remainder = data.length % numberPage;
  let totalPage = data.length / numberPage;
  if (remainder > 0) totalPage++;
  if (currentPage <= totalPage) {
    let initialIndex = (currentPage - 1) * numberPage;
    let limit = currentPage * numberPage;
    let content = "";
    for (let i = initialIndex; i < limit; i++) {
      content += `<div><span class="rank">${data[i].index}</span><a href="https://www.google.com/search?q=${data[i].query}" target="_blank">
      <span>${data[i].query}</span></a></div>`;
    }
    list.innerHTML = content;
    page.dataset.page = currentPage;
    page.innerHTML = `${currentPage}  /  ${totalPage}`;
  }
}

// preRanked.addEventListener("click", (e) => {
//   let list = document.querySelector("#listRanked");
//   let page = document.querySelector("#pageRanked");
//   let currentPage = parseInt(page.dataset.page) - 1;
//   if (currentPage != 0) {
//     let numberPage = 5;
//     let remainder = data.length % numberPage;
//     let totalPage = data.length / numberPage;
//     if (remainder > 0) totalPage++;
//     let initialIndex = (currentPage - 1) * numberPage;
//     let limit = currentPage * numberPage;
//     let content = "";
//     for (let i = initialIndex; i < limit; i++) {
//       content += `<div><span class="rank">${rankedData[i].index}</span><a href="https://www.google.com/search?q=${rankedData[i].query}" target="_blank">
//       <span>${rankedData[i].query}</span></a></div>`;
//     }
//     list.innerHTML = content;
//     page.dataset.page = currentPage;
//     page.innerHTML = `${currentPage}  /  ${totalPage}`;
//   }
// });

// nextRanked.addEventListener("click", (e) => {
//   let list = document.querySelector("#listRanked");
//   let page = document.querySelector("#pageRanked");
//   let currentPage = parseInt(page.dataset.page) + 1;
//   let numberPage = 5;
//   let remainder = data.length % numberPage;
//   let totalPage = data.length / numberPage;
//   if (remainder > 0) totalPage++;
//   if (currentPage <= totalPage) {
//     let initialIndex = (currentPage - 1) * numberPage;
//     let limit = currentPage * numberPage;
//     let content = "";
//     for (let i = initialIndex; i < limit; i++) {
//       content += `<div><span class="rank">${rankedData[i].index}</span><a href="https://www.google.com/search?q=${rankedData[i].query}" target="_blank">
//       <span>${rankedData[i].query}</span></a></div>`;
//     }
//     list.innerHTML = content;
//     page.dataset.page = currentPage;
//     page.innerHTML = `${currentPage}  /  ${totalPage}`;
//   }
// });

// Header scroll down to hide
let prevScrollpos = $(window).scrollTop();
$(window).scroll((e) => {
  let currentScrollPos = $(window).scrollTop();
  if (prevScrollpos >= currentScrollPos) {
    $(".header").css("top", "0");
  } else {
    $(".header").css("top", "-20vh");
  }
  prevScrollpos = currentScrollPos;
});
