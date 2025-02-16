const Router = require('express')
const router = new Router()
const conrtoller = require('./authController')
const { check } = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
router.post('/registration', [
	check("username", "username can't be empty").notEmpty(),
	check("password", "minimum password length is 4 characters").isLength({min:4, max:20})
], conrtoller.registration)
router.post('/login', conrtoller.login)
router.get('/users', authMiddleware, conrtoller.getUsers)
router.get('/check-token', conrtoller.checkToken)

module.exports = router;