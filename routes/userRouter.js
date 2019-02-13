const userRouter = require('express').Router();
const { sendUsers, addUser, sendUser } = require('../controllers');
const { handle405 } = require('../errors');

userRouter.route('/')
  .get(sendUsers)
  .post(addUser)
  .all(handle405);

userRouter.route('/:username')
  .get(sendUser)
  .all(handle405);

module.exports = userRouter;
