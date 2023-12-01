const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getBits', mid.requiresLogin, controllers.Bit.getBits);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/changePass', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePass);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Bit.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Bit.makeBit);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
