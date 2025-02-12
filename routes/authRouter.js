const Router = require('express')
const router = new Router()
const conrtoller = require('./authController')
const { check } = require("express-validator")
const authMiddlewere = require("../middleware/authMiddleware")
const roleMiddlewere = require("../middleware/roleMiddleware")
router.post('/registration', [
	check("username", "username can't be empty").notEmpty(),
	check("password", "minimum password length is 4 characters").isLength({min:4, max:20})
], conrtoller.registration)
router.post('/login', conrtoller.login)
router.get('/users', roleMiddlewere([ "USER", "ADMIN" ]), conrtoller.getUsers)

module.exports = router;