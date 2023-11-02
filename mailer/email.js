const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve("./mailer/templates/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./mailer/templates/"),
};

const sendEmail = async (email, subject, template, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    transporter.use("compile", hbs(handlebarOptions));
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      template: template,
      context: {
        link: link,
      },
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
