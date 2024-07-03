require('dotenv').config()
const dev = {
    PORT: process.env.PORT || 6001,
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_VALIDITY: process.env.JWT_VALIDITY || '7d',
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/test',
    DB_NAME: process.env.DB_NAME || 'test',
    DB_POOLSIZE: process.env.DB_POOLSIZE || 10,
    LOGIN_HARD_LIMIT_ADMIN: process.env.LOGIN_HARD_LIMIT_ADMIN || 5,
    FORGET_JWT_VALIDITY: process.env.FORGET_JWT_VALIDITY || '5h',
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    AWS_REGION: process.env.AWS_REGION || 'ap-southeast-1',
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || '',
    MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID || '',
    FORGET_URL: process.env.FORGET_URL || '',

    MAIL_TRANSPORTER: {
        service: process.env.SMTP_SERVICES || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USERNAME || 'test321240@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'jrtgxhnpdkegbxhp'
        },
        secure: false,
        requireTLS: false
    },
    SMTP_FROM: process.env.SMTP_FROM || 'test321240@gmail.com',
    API_PREFIX: process.env.API_PREFIX || '/admin',
}

const prod = {
    PORT: process.env.PORT || 7001,
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_VALIDITY: process.env.JWT_VALIDITY || '7d',
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/test',
    DB_NAME: process.env.DB_NAME || 'test',
    DB_POOLSIZE: process.env.DB_POOLSIZE || 10,
    LOGIN_HARD_LIMIT_ADMIN: process.env.LOGIN_HARD_LIMIT_ADMIN || 5,
    FORGET_JWT_VALIDITY: process.env.FORGET_JWT_VALIDITY || '5h',
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '',
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
    AWS_REGION: process.env.AWS_REGION || 'ap-southeast-1',
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY || '',
    MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID || '',
    FORGET_URL: process.env.FORGET_URL || '',

    MAIL_TRANSPORTER: {
        service: process.env.SMTP_SERVICES || 'gmail',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USERNAME || 'test321240@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'jrtgxhnpdkegbxhp'
        },
        secure: false,
        requireTLS: false
    },
    SMTP_FROM: process.env.SMTP_FROM || 'test321240@gmail.com',
    API_PREFIX: process.env.API_PREFIX || '/admin',
}

module.exports = process.env.NODE_ENV === 'prod' ? prod : dev 