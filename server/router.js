// using code from DomoMaker E by Aidan Kaufman
const controllers = require('./controllers');
const models = require('./models');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getCats', mid.requiresLogin, controllers.Cat.getCats);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Cat.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Cat.makeCat);
  app.post('/findByID', mid.requiresLogin, models.Cat.findByID);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

