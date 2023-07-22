const express = require('express')
const router = express.Router()
const AuthController = require('../Controllers/Auth.Controller')
const createError = require('http-errors')
const { verifyRefreshToken } = require('../helpers/jwt_helper')

router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout', AuthController.logout)

router.get('/isLoggedIn', async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refreshtoken']
        console.log(req.cookies['refreshtoken'])
        if (!refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        res.send(userId)
    } catch (error) {
        next(error)
    }
})

module.exports = router
