require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl = process.env.MONGODB_URL;
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "dk29dKSJJB826$$^@8dsflkj*&"
const smtpUserName = process.env.SMTP_USERNAME
const smtpPassword = process.env.SMTP_PASSWORD
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

module.exports = { serverPort, mongodbUrl, jwtActivationKey, smtpUserName, smtpPassword, clientUrl };
