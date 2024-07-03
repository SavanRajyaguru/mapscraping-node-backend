const { body, query } = require('express-validator')
const { messages } = require('../../helper/api.responses')


const adminLogin = [
  body('sEmail').trim().isEmail().notEmpty(),
  body('sPassword').trim().notEmpty(),
]

const resetPassword = [
  body('sNewPassword').notEmpty().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage(messages.invalid_pass),
  query('sToken').notEmpty()
]

const changePassword = [
  query('id').isMongoId(),
  body('sOldPassword').notEmpty(),
  body('sNewPassword').notEmpty().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage(messages.invalid_pass)
]

module.exports = {
  adminLogin,
  resetPassword,
  changePassword
}