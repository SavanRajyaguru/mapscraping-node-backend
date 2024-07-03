const { validationResult } = require('express-validator')
const { status, messages } = require('../helper/api.responses')
const { encryption, catchError, pick, removeNull } = require('../helper/utilities.services')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const AdminModel = require('../models-routes-services/auth/model')
const validateAdmin = async (req, res, next) => {
    try {
        const token = req.headers['Authorization']
        const admin = AdminModel.findByToken(token)
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.unAuthorized
            })
        }
        req.admin = admin
        next()
    } catch (error) {
        return catchError('validateAdmin middleware', error, res)
    }
}

const validate = function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res
            .status(status.UnprocessableEntity)
            .jsonp({ status: status.UnprocessableEntity, errors: errors.array() })
    }
    next()
}

const authToken = (req, res, next) => {
    try {
        const token = req.headers['Authorization']
        if (!token) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.unAuthorized
            })
        }
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(status.Unauthorized).jsonp({
                    status: status.Unauthorized,
                    message: messages.unAuthorized
                })
            }

            req.decoded = decoded

            next()
        })
    } catch (error) {
        if (error === 'jwt expired') {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.tokenExp
            })
        }
        return catchError('validateAdmin middleware', error, res)
    }
}

const encryptBodyPassword = (req, res, next) => {
    const { sPassword } = req.body
    if (sPassword) {
        req.body.sPassword = encryption(sPassword)
    }
    next()
}

const isAdminAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization')

        if (!token) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.unAuthorized
            })
        }
        const admin = await AdminModel.findByToken(token)
        if (!admin) {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.unAuthorized
            })
        }
        req.admin = admin

        return next()
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(status.Unauthorized).jsonp({
                status: status.Unauthorized,
                message: messages.tokenExp
            })
        }
        return catchError('isAdminAuthenticated.middleware', error, res)
    }
}

const isDuplicate = (fieldNames) => {
    return async (req, res, next) => {
        try {
            for (const field of fieldNames) {
                const subArray = req.body[field]
                const set = new Set()
                for (const val of subArray) {
                    if (set.has(Number(val.nPriority))) {
                        return res.status(status.BadRequest).jsonp({
                            status: status.BadRequest,
                            message: messages.duplicate.replace('##', field)
                        })
                    }
                    set.add(Number(val.nPriority))
                }
            }
            next()
        } catch (error) {
            return catchError('isDuplicate.middleware', error, res)
        }
    }
}

const isBodyValidation = async (req, res, next) => {
    removeNull(req.body)
    // commaSeparatedArray contains the array of values
    const optionalFields = req.body?.oSeo?.aKeywords
    if (typeof optionalFields === 'string') {
        if (optionalFields !== '' && optionalFields !== null && optionalFields !== undefined) {
            req.body.oSeo.aKeywords = req.body?.oSeo?.aKeywords?.split(',') ?? ''
        }
    }
    switch (req.body.ePage) {
        case 'DOWNLOAD':
            req.body = pick(req.body, ['sIosLink', 'sAndroidPath', 'ePage'])
            break
        case 'FAQ':
            req.body = pick(req.body, ['sPath', 'ePage', 'oSeo'])
            break
        case 'HOME':
            req.body = pick(req.body, ['aOurResults', 'nCusSatisfaction', 'nDailyWinning', 'nAppStoreRate', 'nPlayStoreRate', 'sTagLine', 'ePage', 'aBackGroundImages', 'aWhyChooseUs', 'aHeroImages', 'bOurResultsSwitch', 'oSeo', 'sDownloadSideImage', 'sDownloadMokeUpImage'])
            break
        case 'PLAYSTORE':
            req.body = pick(req.body, ['sAbout', 'aAppImages', 'sRated', 'sDownloads', 'sAvgReview', 'nTotalReview', 'sBackGroundVideo', 'sUpdateOn', 'ePage', 'oSeo'])
            req.body.sUpdateOn = new Date()
            break
        case 'FOOTER':
            req.body = pick(req.body, ['sAppName', 'sAppDisc', 'nNumber', 'aSocialMedia', 'sEmail', 'ePage', 'sCopyRight', 'sBackGroundImage', 'sAIGFCertified', 'sSmsLink'])
            break
        case 'ABOUTUS':
            req.body = pick(req.body, ['sBackGroundVideo', 'sBrandContent', 'sWhoWeAreContent', 'sOurVisionContent', 'sOurVisionSideImage', 'aDynamicPlayerContent', 'sOurTeamDescription', 'aTeamMembers', 'sFounderDescription', 'aFounders', 'aDynamicPlayerContentImages', 'sAddress', 'sWhoWeAreBackImage', 'sOurVisionBackImage', 'ePage', 'oSeo', 'sBackGroundImage', 'bShowImage'])
            break
        case 'MEDIAGLIM':
            req.body = pick(req.body, ['aMediaGlim', 'ePage'])
            break
        case 'HOWTOPLAY':
            req.body = pick(req.body, ['sBackGroundVideo', 'aHowToPlaySteps', 'aVideoTutorial', 'ePage', 'oSeo', 'bHomePageSwitch', 'sBackGroundImage', 'bShowImage'])
            break
        case 'FEATURE':
            req.body = pick(req.body, ['aFantasyFeature', 'ePage'])
            break
        case 'CONTACTUS':
            req.body = pick(req.body, ['sBackGroundImage', 'sNumber', 'sEmail', 'sAddress', 'ePage', 'oSeo'])
            break
        default:
            return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages.invalid_page })
    }
    return next()
}


module.exports = {
    validateAdmin,
    validate,
    authToken,
    encryptBodyPassword,
    isBodyValidation,
    isAdminAuthenticated,
    isDuplicate
}