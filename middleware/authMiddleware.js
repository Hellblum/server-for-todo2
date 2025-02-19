const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function(req, res, next) {
	if(req.method === "OPTIONS") {
		return next();
	}
	try {
		if (!req.headers.authorization) {
			return res.status(403).json({message: "Authorization header missing"});
		}
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			return res.status(403).json({message: "Token missing"});
		}
		const decodedData = jwt.verify(token, secret);
		req.user = decodedData;
		next();
	} catch (e) {
		console.log(e);
		return res.status(403).json({message: "User unauthorized"});
	}
};