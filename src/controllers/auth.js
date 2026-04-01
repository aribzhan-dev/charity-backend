const Admin = require('../models/Admin');
const Company = require('../models/Company');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = await Admin.findOne({ email });
    let role = 'admin';

    if (!account) {
      account = await Company.findOne({ email });
      role = 'company';
    }

    if (!account) {
      account = await User.findOne({ email });
      role = 'user';
    }

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (role === 'company' && !account.isActive) {
      return res.status(403).json({ message: 'Company is blocked' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const payload = {
      id: account._id,
      role,
      ...(role === 'company' && { type: account.type }) 
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    const responseData = {
      message: 'Login successful',
      token,
      role
    };

    if (role === 'admin') {
      responseData.admin = { id: account._id, email: account.email };
    }

    if (role === 'company') {
      responseData.company = {
        id: account._id,
        company_name: account.company_name,
        email: account.email,
        type: account.type
      };
    }

    if (role === 'user') {
      responseData.user = {
        id: account._id,
        name: account.name,
        email: account.email
      };
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login };