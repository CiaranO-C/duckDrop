const { Router } = require('express');
const indexController = require('../controllers/indexController');
const passport = require('../config/passport');
const indexRouter = Router();

indexRouter.get('/', indexController.getHome);
indexRouter.get('/sign-up', indexController.getSignUp);
indexRouter.get('/login', indexController.getLogin);

indexRouter.post('/sign-up', indexController.postSignUp);
indexRouter.post('/login', passport.authenticate('local', { successRedirect: '/user', failureRedirect: '/login'}));

module.exports = indexRouter;