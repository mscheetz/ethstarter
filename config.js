const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    mnemonic: process.env.WEB3_MNEMONIC,
    infuraKey: process.env.INFURA_API_KEY
};