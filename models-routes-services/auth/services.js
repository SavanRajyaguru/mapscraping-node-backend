const jwt = require('jsonwebtoken')
const AdminModel = require('./model')
const config = require('../../config/config')
const { status, messages } = require('../../helper/api.responses')
const { sendMail } = require('../../helper/email.service')
const { catchError, pick, encryption } = require('../../helper/utilities.services')

async function register(req, res) { 
    try {
        const { sEmail, nNumber } = req.body
        const isDisposableMail = (email) => tempDomains.includes(email.split('@')[1])
        if (isDisposableMail) { 

        }
    } catch (error) {
        return catchError('register', error, res)
    }
}

// This is an asynchronous function named 'login' which handles the login request.
async function login(req, res) {
    try {
        // Extracting email and password from the request body
        const { sEmail, sPassword } = req.body
        // Searching for an admin user in the database with the provided email and status 'Y'
        let admin = await AdminModel.findOne({ sEmail: sEmail, 'eStatus': 'Y' })
        // If no admin user is found, return an Unauthorized status with an invalid credentials message
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.invalidCredentials
            })
        }
        // If an admin user is found, generate a JWT token with the admin's id as payload
        const sToken = jwt.sign({ _id: (admin._id) }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
        // Check if the number of JWT tokens is less than the hard limit or if the hard limit is 0
        // If true, add the new token to the list of tokens
        // If false, remove the oldest token and add the new token
        if (admin.aJwtTokens.length < config.LOGIN_HARD_LIMIT_ADMIN || config.LOGIN_HARD_LIMIT_ADMIN === 0) {
            admin.aJwtTokens.push(sToken)
        } else {
            admin.aJwtTokens.shift()
            admin.aJwtTokens.push(sToken)
        }
        // Save the updated admin user to the database
        await admin.save()
        // If the provided password matches the admin's password, filter the admin data and return an OK status with the admin data and the token
        // If the password does not match, return an Unauthorized status with an invalid credentials message
        if (admin.sPassword === sPassword) {
            admin = AdminModel.filterData(admin)
            return res.status(status.OK).set('Authorization', sToken).jsonp(
                {
                    status: status.OK,
                    message: messages.loginSuccess,
                    data: admin,
                    Authorization: sToken
                })
        }
        return res.status(status.Unauthorized).jsonp({
            status: status.Unauthorized,
            message: messages.invalidCredentials
        })
    } catch (error) {
        // If any error occurs during the process, catch the error and handle it
        return catchError('adminAuthServices.login', error, res)
    }
}

// This is an asynchronous function named 'changePassword' which handles the password change request.
async function changePassword(req, res) {
    try {
        // Extracting old and new password from the request body
        req.body = pick(req.body, ['sOldPassword', 'sNewPassword'])
        const { sOldPassword, sNewPassword } = req.body
        // If the encrypted old password does not match the current password, return a BadRequest status with an error message
        if (encryption(sOldPassword) !== req.admin.sPassword) {
            return res.status(status.BadRequest).jsonp({
                status: status.BadRequest,
                message: messages.wrong_old_field
            })
        }
        // If the old password is the same as the new password, return a BadRequest status with an error message
        if (sOldPassword === sNewPassword) {
            return res.status(status.BadRequest).jsonp({
                status: status.BadRequest,
                message: messages.old_new_field_same
            })
        }
        // Update the password in the database with the encrypted new password
        const admin = await AdminModel.findByIdAndUpdate(req.query.id, {
            sPassword: encryption(sNewPassword)
        }).lean()
        // If no admin user is found, return an Unauthorized status with an invalid credentials message
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.invalidCredentials
            })
        }
        // If the password is updated successfully, return an OK status with a success message
        return res.status(status.OK).jsonp({
            status: status.OK,
            message: messages.update_success,
        })
    } catch (error) {
        // If any error occurs during the process, catch the error and handle it
        return catchError('UserAuth.changePassword', error, res)
    }
}

// This is an asynchronous function named 'forgotPassword' which handles the forgot password request.
async function forgotPassword(req, res) {
    try {
        // Extracting email from the request body
        const { sEmail } = req.body
        // Searching for an admin user in the database with the provided email and status 'Y'
        const admin = await AdminModel.findOne({ sEmail: sEmail, 'eStatus': 'Y' }).lean()
        // If no admin user is found, return an Unauthorized status with an invalid credentials message
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.invalidCredentials
            })
        }
        // If an admin user is found, generate a JWT token with the admin's id as payload
        const sToken = jwt.sign({ _id: (admin._id) }, config.JWT_SECRET, { expiresIn: config.FORGET_JWT_VALIDITY })
        // Send a forgot password email with the generated token
        const isSuccess = await sendMail('Forgot Password', sEmail, sToken)
        // If the email sending fails, return an Internal Server Error status with an error message
        if (!isSuccess)
            return res.status(status.InternalServerError).jsonp({
                status: status.InternalServerError,
                message: messages.link_sent_error
            })
        // If the email is sent successfully, return an OK status with a success message and the token
        return res.status(status.OK).jsonp({
            status: status.OK,
            message: messages.link_sent,
            sToken: sToken
        })
    } catch (error) {
        // If any error occurs during the process, catch the error and handle it
        return catchError('AdminAuth.forgotPassword', error, res)
    }
}

// This is an asynchronous function named 'resetPassword' which handles the password reset request.
async function resetPassword(req, res) {
    try {
        // Extracting token from the request query and new password from the request body
        const { sToken } = req.query
        const { sNewPassword } = req.body
        let result
        // Verifying the provided JWT token
        jwt.verify(sToken, config.JWT_SECRET, (err, decoded) => {
            // If the token is invalid, return an Unauthorized status with an unauthorized message
            if (err) {
                return res.status(status.Unauthorized).jsonp({
                    status: status.Unauthorized,
                    message: messages.unAuthorized
                })
            }
            // If the token is valid, store the decoded payload in 'result'
            result = decoded
        })
        // Update the password in the database with the encrypted new password
        const admin = await AdminModel.findByIdAndUpdate(result._id, {
            sPassword: encryption(sNewPassword)
        }).lean()
        // If no admin user is found, return an Unauthorized status with an invalid credentials message
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.invalidCredentials
            })
        }
        // If the password is updated successfully, return an OK status with a success message
        return res.status(status.OK).jsonp({
            status: status.OK,
            message: messages.update_success
        })
    } catch (error) {
        // If any error occurs during the process, catch the error and handle it
        return catchError('AdminAuth.resetPassword', error, res)
    }
}

// This is an asynchronous function named 'logout' which handles the logout request.
async function logout(req, res) {
    try {
        // Extracting the authorization token from the request header
        const token = req.header('Authorization')
        // Removing the token from the list of JWT tokens in the database
        await AdminModel.updateOne({ _id: req.admin._id }, { $pull: { aJwtTokens: token } })
        // If the token is removed successfully, return an OK status with a success message
        return res.status(status.OK).jsonp({
            status: status.OK,
            message: messages.logout_success
        })
    } catch (error) {
        // If any error occurs during the process, catch the error and handle it
        return catchError('AdminAuth.logout', error, res)
    }
}


module.exports = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    logout,
    register
}