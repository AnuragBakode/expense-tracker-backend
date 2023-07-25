const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')

module.exports = {
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)

      const doesExist = await User.findOne({ email: result.email })
      if (doesExist)
        throw createError.Conflict(`${result.email} is already been registered`)

      const user = new User(result)
      const savedUser = await user.save()
      res.send("Successfully created an account")
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      // const result = await authSchema.validateAsync(req.body)
      console.log("Inside Login")
      const user = await User.findOne({ email: req.body.email })
      if (!user) throw createError.NotFound('User not registered')

      const isMatch = await user.isValidPassword(req.body.password)
      if (!isMatch)
        throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)

      res.cookie("accesstoken", accessToken, { sameSite: 'None', secure: true, httpOnly: true })
      res.cookie("refreshtoken", refreshToken, { sameSite: 'None', secure: true, httpOnly: true })

      res.send({ accessToken, refreshToken })
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies['refreshtoken']
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)

      res.clearCookie()

      res.cookie("accesstoken", accessToken, { sameSite: 'None', secure: true, httpOnly: true })
      res.cookie("refreshtoken", refToken, { sameSite: 'None', secure: true, httpOnly: true })

      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      console.log(req.cookies['refreshtoken'])
      const refreshToken = req.cookies['refreshtoken']
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      res.clearCookie()
      client.DEL(userId, (err, val) => {
        if (err) {
          throw createError.InternalServerError()
        }
        res.sendStatus(204)

      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  },
}
