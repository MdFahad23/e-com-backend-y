const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: smtpUserName,
        pass: smtpPassword
    }
});

module.exports.emailWithNodeMail = async (emailData) => {
    try {
        const mailOptions = {
            from: smtpUserName,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.html,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Message sent: %s', info.response);
    } catch (error) {
        console.error('Error occured while sending email: ', error);
        throw error
    }
}