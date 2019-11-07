const express = require('express')
const cors = require('cors')
const requireDir = require('require-dir')

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000'
    // TODO: add netlify URL
  ]
}))

const routes = requireDir('./routes')

Object
  .values(routes)
  .forEach(route => route(app))

module.exports = app
