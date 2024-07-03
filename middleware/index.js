const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const logger = require('morgan')

module.exports = (app) => {
    app.use(cors({
        origin: '*',
        methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH'
        ],
        allowedHeaders: [
        'Access-Control-Allow-Headers', 'Content-Type, Authorization'
        ]
    }))
    app.use(helmet())
    if (process.env.NODE_ENV !== 'prod') app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    // set language in request object
    app.use((req, res, next) => {
        switch (req.header('Language')) {
        case 'hi':
        req.userLanguage = 'Hindi'
        break

        case 'en-us':
        req.userLanguage = 'English'
        break

        default :
        req.userLanguage = 'English'
        }
        next()
    })
}