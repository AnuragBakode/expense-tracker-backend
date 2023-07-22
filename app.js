const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
require('./helpers/init_redis')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const AuthRoute = require('./Routes/Auth.route')
const ExpenseRoute = require('./Routes/Expense.route')

const app = express()
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: true, credentials: true }));


app.get('/', verifyAccessToken, async (req, res, next) => {
  res.send(req.payload)
})

app.use('/auth', AuthRoute)
app.use(ExpenseRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
