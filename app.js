const express = require("express");
const engine = require("ejs-locals");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const exploreRouter = require("./routes/explore");
const searchRouter = require("./routes/search");
const app = express();

app.engine("ejs", engine);
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/trends", indexRouter);
app.use("/explore", exploreRouter);
app.use("/search", searchRouter);

app.get("/", (req, res) => {
  res.redirect("/trends");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening to port " + port);
});
