const express = require("express");
const router = express.Router();
const User = require('../models/user');

router.get('/user', (req, res) => {
  let d = new Date();
  let qry = "";
  if(req.query.id) {
    qry = req.query.id;
  }
  else if(req.isLogin){
    qry = req.user.id;
  }
  else {
    res.status(401).send("Not logged in");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] User query failed: Not login`);
    return;
  }

  if(qry !== "") {
    User.findById(qry, '_id name email', (err, _user) => {
      if(err) return errHandler(err, res);
      else if(!_user) res.status(404).send(null);
      else res.status(200).send(_user.toObject());
    });
  }
  else {
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] User query failed: No query id`);
    res.status(400).send("Missing value");
  }
});

router.get('/users', (req, res) => {
  User.find({}, "_id name email sigPubKey").exec((err, found) => {
    if(err) return errHandler(err, res);
    else res.status(200).json(found);
  })
});

router.get('/redirect/:path', (req, res) => {
  res.redirect(req.params.path);
});

router.get('/redirect/', (req, res) => {
  res.redirect("/");
});

const errHandler = (err, res) => {
  console.error(err);
  res.status(500).send("Server error");
}
module.exports = router;