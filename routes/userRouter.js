const userRouter = require('express').Router();
const { sendUsers, addUser, sendUser } = require('../controllers');

userRouter.route('/')
  .get(sendUsers)
  .post(addUser);

userRouter.route('/:username')
  .get(sendUser);

module.exports = userRouter;
