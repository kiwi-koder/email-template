require("env2")(".env");
const Email = require("email-templates");
const nodemailer = require("nodemailer");
const path = require("path");

let transporter = nodemailer.createTransport({
  secure: true,
  service: process.env.PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

let users = [
  {
    name: "Josh",
    email: "joshuarippon1@gmail.com"
  }
];

const loadTemplate = (templateName, contexts) => {
  let email = new Email({
    message: {
      from: process.env.EMAIL
    },
    views: {
      root: path.join(__dirname, "templates"),
      options: {
        extension: "hbs"
      },
      transport: transporter,
      send: true
    }
  });

  return Promise.all(
    contexts.map(context => {
      return email.renderAll(
        templateName,

        context
      );
    })
  ).catch(err => console.log(err));
};

loadTemplate("welcome", users).then(result => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to: "joshuarippon1@gmail.com",
    ...result[0]
  });
});
