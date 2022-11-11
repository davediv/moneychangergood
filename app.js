const express = require("express");
const app = express();
const port = 3003;
const router = require("./routes/route");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "moneychangergood",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: true,
    },
  })
);
app.use(router);

app.listen(port, () => {
  console.log(`Server run on port ${port}`);
});
