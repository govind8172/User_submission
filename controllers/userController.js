const User = require('../models/User');
const Joi = require('joi');

// Joi schema for user creation
const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email } = value;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}); // Find all users
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers, // <--- EXPORT THE NEW FUNCTION
};