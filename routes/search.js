const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const axios = require("axios");
require("dotenv").config();

function getSearchResults(keyword, geoLocation, startIndex) {
  const apiKey = process.env.API_KEY;
  const engineId = process.env.ENGINE_ID;
  const params = `q=${keyword}&start=${startIndex}&gl=${geoLocation}&key=${apiKey}&cx=${engineId}&sort=date&dateRestrict=d30`;
  const url = `https://www.googleapis.com/customsearch/v1?${params}`;
  return axios.get(url);
}

router.get("/", async (req, res) => {
  const startIndex = 1;
  const keyword = req.query.q;
  const geoLocation = req.query.geo;

  // Get google search results
  try {
    const response = await getSearchResults(keyword, geoLocation, startIndex);
    const items = response.data.items;
    const contents = [];

    if (items && items.length > 0) {
      items.forEach((item) => {
        const title = item.htmlTitle;
        const link = item.link;
        const snippet = item.htmlSnippet;
        const formattedUrl = item.htmlFormattedUrl;
        contents.push({
          title: title,
          link: link,
          snippet: snippet,
          url: formattedUrl,
        });
      });
    }
    res.render("search", {
      regions,
      keyword,
      geoLocation,
      contents,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/:index", async (req, res) => {
  const keyword = req.query.q;
  const geoLocation = req.query.geo;
  const startIndex = req.params.index;

  // Get google search results
  try {
    const response = await getSearchResults(keyword, geoLocation, startIndex);
    const items = response.data.items;
    const contents = [];

    if (items && items.length > 0) {
      items.forEach((item) => {
        const title = item.htmlTitle;
        const link = item.link;
        const snippet = item.htmlSnippet;
        const formattedUrl = item.htmlFormattedUrl;
        contents.push({
          title: title,
          link: link,
          snippet: snippet,
          url: formattedUrl,
        });
      });
    }
    res.json(contents);
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
