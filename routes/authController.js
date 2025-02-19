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
			const candidate = await User.findOne({username})
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
				// res.cookie('token', token, {
				// 	httpOnly: false,
				// 	secure: false,
				// 	sameSite: 'None'
				// });
				// console.log('Token set in cookie:', token);
				// return res.json({ success: true });
		} catch (e) {
				console.log(e);
				res.status(400).json({ message: "Login error" });
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

	// async checkToken(req, res) {
	// 	try {
	// 			const token = req.cookies.token;
	// 			if (!token) {
	// 				console.log("Token not found in cookies");
	// 				return res.status(403).json({ message: "User unauthorized" });
	// 			}
	// 			console.log("Token found in cookies:", token);
	// 			const decodedData = jwt.verify(token, secret);
	// 			req.user = decodedData;
	// 			console.log("Token is valid", decodedData);
	// 			res.status(200).json({ message: "Token is valid", user: decodedData });
	// 	} catch (e) {
	// 			console.log("Token verification failed", e);
	// 			return res.status(403).json({ message: "Token verification failed" });
	// 	}
	// }

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

	async logout(req, res) {
		try {
				res.cookie('token', '', {
					httpOnly: true,
					expires: new Date(0),
					path: '/'
				});
				res.status(200).json({ message: 'Logged out' });
		} catch (e) {
				console.log(e);
				res.status(500).json({ message: "Error during logout" });
		}
	}
}

module.exports = new authController()