const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const googleTrends = require("google-trends-api");

function getRelatedTopics(keyword, geoLocation, start) {
  return new Promise((resolve, reject) => {
    googleTrends
      .relatedTopics({
        keyword: keyword,
        geo: geoLocation,
        startTime: new Date(start),
        hl: "zh-TW",
      })
      .then((results) => {
        let relatedTopics = [];
        if (results.length > 0 && results.includes("default")) {
          let rankedList = JSON.parse(results).default.rankedList;
          let rankedTopic = rankedList[0].rankedKeyword;
          let recentTopic = rankedList[1].rankedKeyword;
          if (rankedTopic.length && recentTopic.length) {
            relatedTopics = [rankedTopic, recentTopic];
          } else if (rankedTopic.length && !recentTopic.length) {
            relatedTopics = [rankedTopic, []];
          } else if (!rankedTopic.length && recentTopic.length) {
            relatedTopics = [[], recentTopic];
          } else {
            relatedTopics = [[], []];
          }
          resolve(relatedTopics);
        } else {
          relatedTopics = [[], []];
          resolve(relatedTopics);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getRelatedQueries(keyword, geoLocation, start) {
  return new Promise((resolve, reject) => {
    googleTrends
      .relatedQueries({
        keyword: keyword,
        geo: geoLocation,
        startTime: new Date(start),
      })
      .then((results) => {
        let relatedKeywords = [];
        if (results.length > 0 && results.includes("default")) {
          let rankedList = JSON.parse(results).default.rankedList;
          let rankedKeyword = rankedList[0].rankedKeyword;
          let recentKeyword = rankedList[1].rankedKeyword;
          if (rankedKeyword.length && recentKeyword.length) {
            relatedKeywords = [rankedKeyword, recentKeyword];
          } else if (rankedKeyword.length && !recentKeyword.length) {
            relatedKeywords = [rankedKeyword, []];
          } else if (!rankedKeyword.length && recentKeyword.length) {
            relatedKeywords = [[], recentKeyword];
          } else {
            relatedKeywords = [[], []];
          }
          resolve(relatedKeywords);
        } else {
          relatedKeywords = [[], []];
          console.log(results);
          resolve(relatedKeywords);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

router.get("/", async (req, res) => {
  let geoLocation = req.query.geo;
  let keyword = req.query.q;
  // Get the date of 12 month ago from now
  let start = new Date();
  start = new Date(start.setFullYear(start.getFullYear() - 1));
  start = start.toISOString().slice(0, 10); // Set yyyy-mm-dd format;
  // Get relatedQueries and relatedTopics data
  try {
    let [relatedKeywords, relatedTopics] = await Promise.all([
      getRelatedQueries(keyword, geoLocation, start),
      getRelatedTopics(keyword, geoLocation, start),
    ]);

    res.render("explore", {
      regions: regions,
      query: keyword,
      geoLocation: geoLocation,
      rankedKeyword: relatedKeywords[0],
      recentKeyword: relatedKeywords[1],
      rankedTopic: relatedTopics[0],
      recentTopic: relatedTopics[1],
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
