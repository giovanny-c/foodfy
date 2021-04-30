const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({ //mailtrap
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1d7a6521029b25",
      pass: "08c2186d98ba7c"
    }
});

