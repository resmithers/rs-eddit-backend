const { ...topicFuncs } = require('./topics');
const { ...articleFuncs } = require('./articles');
// const { ...commentFuncs } = require('./comments');

module.exports = { ...topicFuncs, ...articleFuncs };
