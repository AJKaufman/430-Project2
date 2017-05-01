// using code from DomoMaker E by Aidan Kaufman
const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Rar...fill all fields please' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Rar...all fields need to be filled! :(' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Rar...the passwords don\'t match! :(' });
  }


  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    // creates a new model of this user's data
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    // promises to save the user's data
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });


    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePass = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.passNew = `${req.body.passNew}`;


  return Account.AccountModel.authenticate(req.body.username, req.body.pass, (err, account) => {
    
    if(err || !account) {
      return res.status(401).json({ error: 'Meow...incorrect username or pass'})
    }
    
    const newAccount = account;
    
    return Account.AccountModel.generateHash(req.body.passNew, (salt, hash) => {
      newAccount.password = hash;
      newAccount.salt = salt;
      
      const savePromise = newAccount.save();
      
      savePromise.then(() => res.json({
        password: newAccount.password,
      }));
      
      savePromise.catch((saveErr) => {
        res.json(saveErr);
      });
      
      return res.json({ redirect: '/maker'});
      
    });
    
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};


module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.changePass = changePass;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;

