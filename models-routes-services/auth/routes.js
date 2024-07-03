const router = require('express').Router()
const validators = require('./validators')
const { login, logout, changePassword, forgotPassword, resetPassword } = require('./services')
const { validate, isAdminAuthenticated, encryptBodyPassword } = require('../../middleware/middleware')


router
    .post('/user/v1/auth/login', validators.adminLogin, validate, encryptBodyPassword, login)
    .put('/user/v1/auth/logout', isAdminAuthenticated, logout)
    .post('/user/v1/auth/change-password', validators.changePassword, validate, isAdminAuthenticated, changePassword)
    .post('/user/v1/auth/forgot-password', validators.adminLogin[0], validate, forgotPassword)
    .post('/user/v1/auth/reset-password', validators.resetPassword, validate, resetPassword)

module.exports = router