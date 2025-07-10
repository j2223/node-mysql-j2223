const express = require('express');
const router = express.Router();
const knex = require("../knex");
const bcrypt = require("bcrypt");

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render("signin", {
    title: "Sign in",
    isAuth: isAuth,
  });
});

router.post('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const username = req.body.username;
  const password = req.body.password;

  knex("users")
    .where({
      name: username,
    })
    .select("*")
   .then(function(results) {
  const comparedPassword = bcrypt.compare(password, results[0].password);
  if (results.length === 0) {
    res.render("signin", {
      title: "Sign in",
      errorMessage: ["ユーザが見つかりません"],
      isAuth: isAuth,
    });
  } else {
    req.session.regenerate((err) => {
      req.session.userid = results[0].id;
      req.session.username = results[0].name;
      res.redirect('/');
    });
  }
})
});

module.exports = router;