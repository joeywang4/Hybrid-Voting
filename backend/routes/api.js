const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Election = require('../models/election');
const Ballot = require('../models/ballot');

/* Handle Users */
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

router.post('/searchUser', (req, res) => {
  const pubKey = req.body.sigPubKey;
  if(!pubKey) {
    res.status(400).send("Missing field");
    return;
  }
  User.findOne({sigPubKey: pubKey}, (err, user) => {
    if(user) res.status(200).send(user.toObject());
    else res.status(400).send();
  })
})

/* Handle Elections */
router.post('/election', async (req, res) => {
  /*
    TODOs
    - Check admin
    - Validate voters
  */
  let d = new Date();
  if(!req.isLogin) {
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Create election failed: Not login`);
    res.status(401).send("Not logged in");
    return;
  }
  const _title = req.body.title;
  const _description  = req.body.description;
  const _choices = req.body.choices;
  const _voters = req.body.voters;
  const _address = req.body.address;
  if(!_title || !_description || !_choices || !_voters || !_address){
    res.status(400).send("Missing field");
    return;
  }

  // Check existence of same title or address
  const pass = await Election.find({$or: [{'title': _title}, {'address': _address}]})
  .then(_election => {
    if(_election.length > 0) res.status(400).send("Title already used or same election already created!");
    else return true;
  })
  .catch(err => errHandler(err, res, "Check existence error"));
  if(!pass) return;

  let _voterIds = [];
  for(let i = 0;i < _voters.length;i++) {
    let id = undefined;
    await User.findOne({email: _voters[i]})
    .then(user => {
      id = user._id;
      return;
    })
    .catch(error => { console.error(error); });
    _voterIds.push(id);
  }

  const newElection = Election({
    title: _title,
    description: _description, 
    choices: _choices,
    voters: _voterIds,
    address: _address,
    ballots: []
  });
  const done = await newElection.save()
  .then(_ => true)
  .catch(err => errHandler(err));

  if(done) {
    let d = new Date();
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Create election success: ${_title} ${_address}`);
    res.status(200).send("Create election success");
  }
  else res.status(400).send("Create election failed");
  return;
})

router.get('/election', (req, res) => {
  let d = new Date();
  let qry = "";
  if(req.query.address) {
    qry = req.query.address;
  }
  else {
    res.status(400).send("Missing query string: address=[electionAddress]");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Election query failed: No query address`);
    return;
  }

  if(qry !== "") {
    Election.findOne({address: qry}, '_id title description choices voters address ballots')
    .populate({
      path: 'voters',
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: 'voters' }
    })
    .exec((err, _election) => {
      if(err) return errHandler(err, res);
      else if(!_election) res.status(404).send(null);
      else res.status(200).send(_election.toObject());
    });
  }
})

router.get('/elections', (req, res) => {
  Election.find({}, "_id title description address").exec((err, found) => {
    if(err) return errHandler(err, res);
    else res.status(200).json(found);
  })
})

/* Handle Ballots */
router.get('/ballots', (req, res) => {
  let d = new Date();
  let qry = "";
  if(req.query.election) {
    qry = req.query.election;
  }
  else {
    res.status(400).send("Missing query string: election=[electionId]");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Ballots query failed: No election id`);
    return;
  }

  if(qry !== "") {
    Election.findById(qry, 'ballots', (err, _election) => {
      if(err) return errHandler(err, res);
      else if(!_election) res.status(404).send(null);
      else {
        /* Testing */
        console.log("[Testing]", _election);
        res.status(200).send(_election.toObject());
      }
    });
  }
})

router.get('/ballot', (req, res) => {
  let d = new Date();
  let qry = "";
  if(req.query.id) {
    qry = req.query.id;
  }
  else {
    res.status(400).send("Missing query string: id=[ballotId]");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Ballot query failed: No ballot id`);
    return;
  }

  if(qry !== "") {
    Ballot.findById(qry, '_id ballotId rawMsg choice', (err, _ballot) => {
      if(err) return errHandler(err, res);
      else if(!_ballot) res.status(404).send(null);
      else res.status(200).send(_ballot.toObject());
    });
  }
})

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