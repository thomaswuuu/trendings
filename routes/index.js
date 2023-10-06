const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const googleTrends = require("google-trends-api");

function getDailyTrend(res, selectedDate, geoLocation = "TW") {
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
                  traffic < 100 ? `${traffic * 100}萬+` : `${traffic / 100}億+`;
              }
              data.push({
                index: index + 1,
                query: query,
                traffic: traffic,
                image: newsImage,
                articles: articles,
              });
            });
          }
        });
        res.render("index", {
          regions: regions,
          data: data,
          geoLocation: geoLocation,
          selectedDate: selectedDate,
        });
      } else {
        console.log(results);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

router.get("/", (req, res) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  let currentDate = `${year}-${month}-${day}`;
  let geoLocation = req.query.geo;
  if (Boolean(geoLocation)) getDailyTrend(res, currentDate, geoLocation);
  else getDailyTrend(res, currentDate);
});

router.get("/:date", (req, res) => {
  let fullDate = req.params.date;
  let geoLocation = req.query.geo;

  if (Boolean(geoLocation)) getDailyTrend(res, fullDate, geoLocation);
  else getDailyTrend(res, fullDate);
});

module.exports = router;
module.exports.regions = function () {
  return regions;
};
