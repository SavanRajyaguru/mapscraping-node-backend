const nodemailer = require('nodemailer')
const config = require('../config/config')
const { handleCatchError } = require('./utilities.services')
const transporter = nodemailer.createTransport(config.MAIL_TRANSPORTER)

const sendMail = async (subject, to, sToken) => {
    try {
        const nodeMailerOptions = {
            from: `Trade Fantasy Game ${config.SMTP_FROM}`,
            to: to,
            subject: subject,
            html: `Click the link to reset your password: ${config.FORGET_URL}/reset-password/${sToken}`
        }
        const sendEmail = await transporter.sendMail(nodeMailerOptions)
        return sendEmail
    } catch (error) {
        return handleCatchError(error, 'EmailServices.sendMail')
    }
}
module.exports = {
    sendMail
}