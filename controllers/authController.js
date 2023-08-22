const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

module.exports.auth = async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Email incorret " });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword){
			return res.status(401).send({ message: "Mot de passe incorrect" });
		}
		// const token = user.generateAuthToken();/
		// res.status(200).send({ data: token, message: "logged in successfully" });
		res.status(200).send({message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
};

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};