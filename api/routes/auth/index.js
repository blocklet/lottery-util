const { handlers } = require('../../libs/auth');
const prizeHandler = require('./prize');
const signUpHandler = require('./signUp');

module.exports = {
  init(app) {
    handlers.attach({ app, ...prizeHandler, ...signUpHandler });
  },
};
