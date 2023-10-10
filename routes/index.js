const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const googleTrends = require("google-trends-api");

function getDailyTrend(selectedDate, geoLocation) {
  return new Promise((resolve, reject) => {
    let data = [];
    googleTrends
      .dailyTrends({
        trendDate: new Date(selectedDate),
        geo: geoLocation,
      })
      .then((results) => {
        if (results.length > 0 && results.includes("default")) {
          const jsonObj = JSON.parse(results);

          trendingSearchesDays = jsonObj.default.trendingSearchesDays;
          trendingSearchesDays.forEach((element) => {
            let date = element.date;
            if (date === selectedDate.replace(/\-/g, "")) {
              element.trendingSearches.forEach((content, index) => {
                let query = content.title.query;
                let traffic = content.formattedTraffic;
                let newsImage = content.image.imageUrl || "";
                let articles = content.articles;
                // Change traffic string to corresponding value
                // 1K+ -> 1000+ , 10K+ -> 1萬+, 100K+ -> 10萬+
                // 1M+ -> 100萬+, 10M+ -> 1000萬+, 100M+ -> 1億+
                if (traffic.includes("K+")) {
                  traffic = parseInt(traffic.split("K+")[0]);
                  traffic =
                    traffic < 10 ? `${traffic * 1000}+` : `${traffic / 10}萬+`;
                } else if (traffic.includes("M+")) {
                  traffic = parseInt(traffic.split("M+")[0]);
                  traffic =
                    traffic < 100
                      ? `${traffic * 100}萬+`
                      : `${traffic / 100}億+`;
                }
                data.push({
                  index: index + 1,
                  query: query,
                  traffic: traffic,
                  image: newsImage,
                  articles: articles,
                });
              });
              resolve(data);
            }
          });
        } else {
          console.log(results);
          resolve(data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

router.get("/", async (req, res) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  let currentDate = `${year}-${month}-${day}`;
  let geoLocation = req.query.geo;
  let trendData = [];
  try {
    if (!Boolean(geoLocation)) geoLocation = "TW";
    trendData = await getDailyTrend(currentDate, geoLocation);
    res.render("index", {
      regions: regions,
      geoLocation: geoLocation,
      selectedDate: currentDate,
      data: trendData,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/:date", async (req, res) => {
  let fullDate = req.params.date;
  let geoLocation = req.query.geo;

  try {
    if (!Boolean(geoLocation)) geoLocation = "TW";
    trendData = await getDailyTrend(fullDate, geoLocation);
    res.render("index", {
      regions: regions,
      geoLocation: geoLocation,
      selectedDate: fullDate,
      data: trendData,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
