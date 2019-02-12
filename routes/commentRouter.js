const commentRouter = require('express').Router();
const { patchComment, removeCommentsID } = require('../controllers');

commentRouter.route('/:comment_id')
  .patch(patchComment)
  .delete(removeCommentsID);

module.exports = commentRouter;
