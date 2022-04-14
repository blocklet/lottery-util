const { fromTokenToUnit } = require('@ocap/util');
const { fromAddress } = require('@ocap/wallet');
const { client } = require('../../libs/auth');

module.exports = {
  action: 'signUp',
  claims: {
    profile: () => ({
      description: 'Please provide your name',
      fields: ['fullName'],
    }),
  },

  onAuth: async ({ userDid, userPk }) => {},
};
