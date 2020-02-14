const express = require('express')
const cors = require('cors')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/errorHandler')
const sgMail = require('@sendgrid/mail')

const app = express()

app.use(bodyParser.json())

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

app.use(cors())

const routes = requireDir('./routes')

Object
  .values(routes)
  .forEach(route => route(app))

app.use(errorHandler)

module.exports = app
