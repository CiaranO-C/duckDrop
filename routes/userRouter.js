const { Router } = require('express');
const { isUser } = require('../controllers/authenticate');
//const userController = require('../controllers/userController');

const userRouter = Router();

userRouter.use(isUser);

userRouter.get('/', (req, res)=> {
    res.send('you are authentico!')
} );



module.exports = userRouter;