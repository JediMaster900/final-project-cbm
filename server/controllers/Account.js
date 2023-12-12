const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use! ' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const changePass = (req, res) => {
  // grab relevant info from request body
  const username = `${req.body.username}`;
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  // check if all fields are filled in
  if (!username || !oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // check if the new password has been inputted correctly twice
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  // check if the user's original info is correct, and if so, change the password
  return Account.authenticate(username, oldPass, async (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    try {
      const hash = await Account.generateHash(newPass);
      await Account.findByIdAndUpdate(account._id, { password: hash });
      console.log('Password updated');
      return res.json({ redirect: '/login' });
    } catch (err2) {
      console.log(err2);
      return res.status(500).json({ error: 'An error occured!' });
    }
  });
};

const isPremium = async (req, res) => {
  try{
    await Account.findByIdAndUpdate(req.session.account._id, { premium: !this.premium });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error swapping premium status!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePass,
  isPremium,
};
