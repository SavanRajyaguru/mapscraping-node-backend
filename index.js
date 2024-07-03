const express = require('express')

const config = require('./config/config')

const app = express() // Initialize the express application
global.appRootPath = __dirname // Set the root path of the application globally

require('./database/mongoose') // Connect to the MongoDB database using Mongoose

require('./middleware/index')(app) // Load the middlewares into the express application
require('./middleware/routes')(app) // Load the routes into the express application

app.listen(config.PORT, () => { // Start the express application on the configured port
    console.log('Magic happens on port :' + config.PORT)
})

module.exports = app
