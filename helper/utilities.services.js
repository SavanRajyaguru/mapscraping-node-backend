const { status, messages } = require('./api.responses')
const crypto = require('crypto')

const catchError = (name, error, res) => {
    handleCatchError(error, name)
    return res.status(status.InternalServerError).jsonp({
        status: status.InternalServerError,
        message: messages.went_wrong
    })
}
const handleCatchError = (error, name = '') => {
    console.log(`${name} **********ERROR*********** ${error}`)
}

const removeNull = (obj) => {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
            delete obj[propName]
        }
    }
}

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key]
        }
        return obj
    }, {})
}

const encryption = (sPassword) => {
    return crypto.createHash('sha256').update(sPassword).digest('hex').toString()
}

const defaultSearch = (val) => {
    let search
    if (val) {
        search = val.replace(/\\/g, '\\\\')
            .replace(/\$/g, '\\$')
            .replace(/\*/g, '\\*')
            .replace(/\+/g, '\\+')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/\)/g, '\\)')
            .replace(/\(/g, '\\(')
            .replace(/'/g, '\\\'')
            .replace(/"/g, '\\"')
        return search
    } else {
        return ''
    }
}

module.exports = {
    handleCatchError,
    catchError,
    removeNull,
    pick,
    encryption,
    defaultSearch,
}