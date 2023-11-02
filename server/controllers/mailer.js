import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';

//https://ethereal.email/create
let nodeConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'talia.bogisich@ethereal.email',
    pass: 'fukXJCuXbgUy1hr86p',
  },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Mailgen',
    link: 'https://mailgen.js/',
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

/**POST: http://localhost:8080/api/registerMail
 * 
 * @param: {
  "username": "rezuan",
  "userEmail": "1234",
  "text": "",
  "subject": "",
  }
 */
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  //body of the email
  var email = {
    body: {
      name: username,
      intro:
        text || "Welcome to Aunogha! We're very excited to have you on board.",
      outro:
        "Need help, or have qs? Just reply to this email, we'd love to help.",
    },
  };

  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || 'Signup Successful',
    html: emailBody,
  };

  //send mail
  await transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: 'You should receive an email from us.' });
    })
    .catch((e) => res.status(500).send({ e }));
};
