const { status } = require('../helper/api.responses')
module.exports = (app) => {
    app.use('/api', [
        require('../models-routes-services/auth/routes'),
    ])

    app.get('/api/health-check', (req, res) => {
        const sDate = new Date().toJSON()
        return res.status(status.OK).jsonp({ status: status.OK, message: `Route is running ${sDate}` })
    })

    app.all('*', (req, res) => {
        return res.status(status.NotFound).jsonp({ status: status.NotFound })
    })
}