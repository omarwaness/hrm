dbPassword = 'jn4real';

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  gmailPassword: process.env.GMAIL_PASSWORD,
  gmailUser: process.env.GMAIL_USER

};
