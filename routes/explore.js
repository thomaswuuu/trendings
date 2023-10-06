const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const googleTrends = require("google-trends-api");

function getRelatedTopics(
  res,
  keyword,
  relatedKeywords,
  geoLocation = "TW",
  start
) {
  googleTrends
    .relatedTopics({
      keyword: keyword,
      geo: geoLocation,
      startTime: new Date(start),
      hl: "zh-TW",
    })
    .then((results) => {
      if (results.length > 0 && results.includes("default")) {
        let rankedList = JSON.parse(results).default.rankedList;
        let rankedTopic = rankedList[0].rankedKeyword;
        let recentTopic = rankedList[1].rankedKeyword;
        res.render("explore", {
          regions: regions,
          query: keyword,
          geoLocation: geoLocation,
          rankedKeyword: relatedKeywords[0],
          recentKeyword: relatedKeywords[1],
          rankedTopic: rankedTopic,
          recentTopic: recentTopic,
        });
      } else {
        console.log(results);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getRelatedQueries(res, keyword, geoLocation = "TW") {
  // Get the date of 12 month ago from now
  let start = new Date();
  start = new Date(start.setFullYear(start.getFullYear() - 1));
  // Set yyyy-mm-dd format;
  start = start.toISOString().slice(0, 10);
  googleTrends
    .relatedQueries({
      keyword: keyword,
      geo: geoLocation,
      startTime: new Date(start),
    })
    .then((results) => {
      if (results.length > 0 && results.includes("default")) {
        let rankedList = JSON.parse(results).default.rankedList;
        let rankedKeyword = rankedList[0].rankedKeyword;
        let recentKeyword = rankedList[1].rankedKeyword;
        let relatedKeywords = [rankedKeyword, recentKeyword];
        getRelatedTopics(res, keyword, relatedKeywords, geoLocation, start);
      } else {
        console.log(results);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

router.get("/", (req, res) => {
  let geoLocation = req.query.geo;
  let keyword = req.query.q;
  getRelatedQueries(res, keyword, geoLocation);
});

module.exports = router;
