const Admin = require('../models/Admin');
const Company = require('../models/Company');
const User = require('../models/User');
const EventRequest = require('../models/EventRequest');
const CharityRequest = require('../models/CharityRequest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin topilmadi' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Parol noto\'ğri' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: 'Login muvaffaqiyatli', token });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const createCompany = async (req, res) => {
  try {
    const { company_name, email, password, type } = req.body;

    const existing = await Company.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Bu email allaqachon mavjud' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      company_name,
      email,
      password: hashedPassword,
      type
    });

    res.status(201).json({ message: 'Company yaratildi', company });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const getCompanies = async (req, res) => {
  try {
    const { type } = req.query; 

    const filter = type ? { type } : {};
    const companies = await Company.find(filter).select('-password');

    res.status(200).json({ count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};


const getRequests = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = status ? { status } : {};

    let eventRequests = [];
    let charityRequests = [];

    if (!type || type === 'event') {
      eventRequests = await EventRequest.find(filter)
        .populate('company', 'company_name email type');
    }

    if (!type || type === 'charity') {
      charityRequests = await CharityRequest.find(filter)
        .populate('company', 'company_name email type');
    }

    res.status(200).json({
      eventRequests,
      charityRequests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};


const acceptRequest = async (req, res) => {
  try {
    const { id, requestType } = req.params;
    const Model = requestType === 'event' ? EventRequest : CharityRequest;

    const request = await Model.findByIdAndUpdate(
      id,
      { status: 'accepted' },
      { returnDocument: 'after' }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request topilmadi' });
    }

    res.status(200).json({ message: 'Request accepted', request });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const rejectRequest = async (req, res) => {
  try {
    const { id, requestType } = req.params;

    const Model = requestType === 'event' ? EventRequest : CharityRequest;

    const request = await Model.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { returnDocument: 'after' }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request topilmadi' });
    }

    res.status(200).json({ message: 'Request rejected', request });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

module.exports = {
  login,
  createCompany,
  getCompanies,
  getUsers,
  getRequests,
  acceptRequest,
  rejectRequest
};