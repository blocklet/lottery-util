const { fromTokenToUnit } = require('@ocap/util');
const { fromAddress } = require('@ocap/wallet');
const { client } = require('../../libs/auth');

module.exports = {
  action: 'sendPrize',
  claims: {
    signature: async ({ userDid, userPk, extraParams: { locale, chain, amount, toAddress, winName } }) => {
      if (!Number(amount)) {
        throw new Error('Invalid amount param for send token playground action');
      }

      const description = {
        en: `Please pay ${amount} play3 to ` + winName,
        zh: `请支付 ${amount} play3`,
      };

      return {
        type: 'TransferV2Tx',
        data: {
          from: userDid,
          pk: userPk,
          itx: {
            to: toAddress,
            tokens: [
              {
                address: 'z35n3WVTnN7KrR4gXn3szR6oneVefkBBx78Fc',
                value: fromTokenToUnit(amount, 18).toString(),
              },
            ],
          },
        },
        description: description[locale] || description.en,
      };
    },
  },

  onAuth: async ({ claims, userDid, extraParams: { locale } }) => {
    try {
      const claim = claims.find((x) => x.type === 'signature');
      const tx = client.decodeTx(claim.origin);
      const user = fromAddress(userDid);
      if (claim.from) {
        tx.from = claim.from;
      }
      if (claim.delegator) {
        tx.delegator = claim.delegator;
      }
      const hash = await client.sendTransferV2Tx({
        tx,
        wallet: user,
        signature: claim.sig,
      });

      return { hash, tx: claim.origin };
    } catch (err) {
      const errors = {
        en: 'Send token failed!',
        zh: '支付失败',
      };
      throw new Error(errors[locale] || errors.en);
    }
  },
};
