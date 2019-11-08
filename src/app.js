const express = require('express')
const cors = require('cors')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://matcha.netlify.com'
  ]
}))

const routes = requireDir('./routes')

Object
  .values(routes)
  .forEach(route => route(app))

module.exports = app
