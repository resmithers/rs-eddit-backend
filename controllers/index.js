const { serveEndpoints } = require('./utils');
const { ...topicFuncs } = require('./topics');
const { ...articleFuncs } = require('./articles');
const { ...commentFuncs } = require('./comments');
const { ...userFuncs } = require('./users');

module.exports = { serveEndpoints, ...topicFuncs, ...articleFuncs, ...commentFuncs, ...userFuncs };
