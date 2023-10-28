const load = document.querySelector(".load");
const results = document.querySelector(".results");
let index = 11;

load.addEventListener("click", async (e) => {
  // Only show 50 search results for saving API usages
  if (index <= 41) {
    const params = window.location.search.split("?")[1];
    const response = await fetch(`/search/${index}?${params}`);
    const contents = await response.json();

    contents.forEach((content) => {
      results.innerHTML += `<div class="searches phase2">
                              <h4><a href="${content.link}" target="_blank">${content.title}</a></h4>
                              <p class="website">${content.url}</p>
                              <div class="box">
                                <h5>${content.snippet}</h5>
                              </div>
                            </div>`;
    });
    index += 10;
    if (index == 51) load.style.display = "none";
  }
  e.preventDefault();
});
