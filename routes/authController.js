const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require('bcryptjs');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {secret} = require("../config")

const generateAccessToken = (id, roles) => {
	const payLoad = {
		id,
		roles
	}
	return jwt.sign(payLoad, secret, {expiresIn: "24h"})
}

class authController{
	async registration(req, res) {
		try{
			const errors = validationResult(req)
			if(!errors.isEmpty()){
				return res.status(400).json({message: "Error during registration", errors})
			}
			const {username, password} = req.body
			const candidate = await User.findOne({ username })
			if(candidate) {
				return res.status(400).json({message: "this username already exists"})
			}
			const hashPassword = bcrypt.hashSync(password, 8);
			const userRole = await Role.findOne({value: "USER"})
			const user = new User({username, password: hashPassword, roles: [userRole.value]})
			await user.save()
			return res.json({message: "User successfully created"})
		}
		catch (e) {
			console.log(e)
			res.status(400).json({message: "Registration error"})
		}
	}

	async login(req, res) {
		try {
				const { username, password } = req.body;
				const user = await User.findOne({ username });
				if (!user) {
					return res.status(400).json({ message: `User ${username} not found` });
				}
				const validPassword = bcrypt.compareSync(password, user.password);
				if (!validPassword) {
					return res.status(400).json({ message: "Incorrect password" });
				}
				const token = generateAccessToken(user._id, user.roles);
				return res.json({token})
		} catch (e) {
				console.log(e);
				res.status(400).json({ message: "Login error" });
		}
	}

	async checkToken(req, res) {
		try {
				const authHeader = req.headers.authorization;

				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					return res.status(403).json({ message: "User unauthorized" });
				}

				const token = req.headers.authorization.split(" ")[1];
				const decodedData = jwt.verify(token, secret);
				req.user = decodedData;

				res.status(200).json({ message: "Token is valid", user: decodedData });
		} catch (e) {
				console.log("Token verification failed", e);
				return res.status(403).json({ message: "Token verification failed" });
		}
	}

	async getUsers(req, res) {
		try{
			const users = await User.find()
			res.json(users)
		}
		catch (e) {
			console.log(e)
		}
	}
}

module.exports = new authController()