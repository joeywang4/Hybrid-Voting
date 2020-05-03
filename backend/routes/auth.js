const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/user');

router.post('/login', async (req, res) => {
  let d = new Date();
  const _email = req.body.email;
  const _pwd  = req.body.pwd;
  if(!_email || !_pwd){
    res.status(400).send("Missing field");
    return;
  }
  
  // Check user existence
  const user = await User.findOne({email: _email})
  .then(userResponse => {
    if(userResponse === null) {
      console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Login failed: ${_email} user not found`);
      res.status(400).send("Login failed");
      return;
    }
    else return userResponse
  })
  .catch(err => errHandler(err));
  
  if(!user) return;
  const same = await bcrypt.compare(_pwd, user.pwdHash)
  .then(same => same)
  .catch(err => errHandler(err));
  if(!same) {
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Login failed:`, user.email, "wrong password");
    res.status(401).send("Login failed");
    return;
  }

  const sessionInfo = {id: user._id, name: user.name, email: user.email};
  const token = await jwt.sign(sessionInfo, process.env.JWT_SECRET, { expiresIn: '1d'});

  if(token) {
    let d = new Date();
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Login success: ${user.name} ${_email}`);
    res.status(200).json({'token': token, 'name': user.name, 'email': user.email, 'sigPubKey': user.sigPubKey});
  }
  else res.status(500).send("Login failed");

  return;
})

router.post('/register', async (req, res) => {
  const _email = req.body.email;
  const _pwd  = req.body.pwd;
  const _name = req.body.name;
  const _sigPubKey = req.body.sigPubKey
  if(!_name || !_email || !_pwd || !_sigPubKey){
    res.status(400).send("Missing field");
    return;
  }

  // Check existence of same email and name
  const pass = await User.find({$or: [{'name': _name}, {'email': _email}]})
  .then(_user => {
    if(_user.length > 0) res.status(400).send("Name or Email already used");
    else return true;
  })
  .catch(err => errHandler(err, res, "Check existence error"));

  if(!pass) return;

  const _pwdHash = await bcrypt.hash(_pwd, 10)
  .then(_hash => _hash)
  .catch(err => errHandler(err, res, "Create hash error"));

  const newUser = User({name: _name, pwdHash: _pwdHash, email: _email, sigPubKey: _sigPubKey});
  const done = await newUser.save()
  .then(_ => true)
  .catch(err => errHandler(err));

  if(done) {
    let d = new Date();
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Register success: ${_name} ${_email}`);
    res.status(200).send("Register success");
  }
  else res.status(400).send("Register failed");

  return;
})

router.post('/update', async (req, res) => {
  let d = new Date();
  const _name = req.body.name;
  const _oldPwd  = req.body.oldPwd;
  const _newPwd  = req.body.newPwd;
  if(!_name && (!_oldPwd || !_newPwd)){
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Update failed: Missing field, name=${_name} oldpwd=${_oldPwd}, newpwd=${_newPwd}`);
    res.status(400).send("Missing field");
    return;
  }
  if(!req.isLogin) {
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Update failed: Not login`);
    res.status(401).send("Not logged in");
    return;
  }
  const _id = req.user.id;
  
  // Check user existence
  let user = await User.findById(_id)
  .then(userResponse => {
    if(!userResponse) {
      console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] Update failed: user not found`);
      res.status(400).send("Update failed");
      return;
    }
    else return userResponse
  })
  .catch(err => errHandler(err));
  
  if(!user) return;

  let same = true;
  if(_newPwd) {
    same = await bcrypt.compare(_oldPwd, user.pwdHash)
    .then(same => same)
    .catch(err => errHandler(err));
  }
  if(!same) {
    res.status(401).send("Old password mismatch");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] User update failed:`, user.email, "old password mismatch");
    return;
  }

  let _exists = _name.length > 0;
  if(_name) {
    await User.find({name: _name})
    .then(userResponse => {
      if(userResponse.length === 0) {
        user.name = _name;
        _exists = false;
      }
    })
  }
  if(_exists === true) {
    let d = new Date();
    res.status(400).send("User exists");
    console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] User update failed: new name (${_name})`,"already exists");
    return;
  }

  if(_newPwd) {
    const _pwdHash = await bcrypt.hash(_newPwd, 10)
    .then(_hash => _hash)
    .catch(err => errHandler(err, res, "Create hash error"));
    user.pwdHash = _pwdHash;
  }

  await user.save();
  res.status(200).send("Update Success");
  console.log(`[${d.toLocaleDateString()}, ${d.toLocaleTimeString()}] User update success:`, user.email, user.name);
  return;
})

module.exports = router;

/*********
 * Utils *
 *********/

const errHandler = (err, res = null, msg = null) => {
    if(msg) console.error(msg);
    if(res) res.status(500).send("Server Error.");
    return;
}