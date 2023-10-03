const express = require("express");
const router = express.Router();
const regions = require("../models/regions");
const googleTrends = require("google-trends-api");

function getRelatedQueries(res, keyword, geoLocation = "TW") {
  // Get the date of 12 month ago from now
  let start = "";
  googleTrends
    .relatedQueries({
      keyword: keyword,
      geo: geoLocation,
      startTime: new Date("2023-01-01"),
    })
    .then((results) => {
      let rankedList = JSON.parse(results).default.rankedList;
      let rankedKeyword = rankedList[0].rankedKeyword;
      let recentKeyword = rankedList[1].rankedKeyword;
      // rankedKeyword.forEach((element) => {
      //   console.log(element.query, element.value);
      // });
      // console.log("---------------------------------");
      // recentKeyword.forEach((element) => {
      //   console.log(element.query, element.value);
      // });
      // res.json(rankedList);
      res.render("explore", {
        regions: regions,
        query: keyword,
        geoLocation: geoLocation,
        rankedKeyword: rankedKeyword,
        recentKeyword: recentKeyword,
      });
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

router.post("/", (req, res) => {
  console.log("HERE2!");
  res.render("search", { title: "test" });
});

module.exports = router;
