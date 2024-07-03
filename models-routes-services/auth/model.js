const mongoose = require('mongoose')
const { TfgDatabase } = require('../../database/mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const { status } = require('../../helper/enumData')

const Admin = new Schema({
    sUsername: { type: String, trim: true, required: true },
    sPassword: { type: String, trim: true, required: true },
    sEmail: { type: String, trim: true, required: true, unique: true },
    eStatus: { type: String, enum: status, required: true, default: 'Y' },
    aJwtTokens: { type: Array, default: [] }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Admin.statics.filterData = function (admin) {
    admin.__v = undefined
    admin.sVerificationToken = undefined
    admin.aJwtTokens = undefined
    admin.sPassword = undefined
    admin.dUpdatedAt = undefined
    return admin
}

Admin.statics.findByToken = function (token) {
    let decoded
    try {
        decoded = jwt.verify(token, config.JWT_SECRET)
    } catch (e) {
        return Promise.reject(e)
    }

    const query = {
        _id: decoded._id,
        aJwtTokens: token,
        eStatus: 'Y'
    }
    return this.findOne(query)
}

module.exports = TfgDatabase.model('admins', Admin)