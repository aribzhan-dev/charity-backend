const User = require('../models/User');
const EventRequest = require('../models/EventRequest');
const CharityRequest = require('../models/CharityRequest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Bu email allaqachon mavjud' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Ro\'yxatdan o\'tildi',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Parol noto\'ğri' });
    }

    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login muvaffaqiyatli',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await EventRequest.find({ status: 'accepted' })
      .populate('company', 'company_name')
      .select('-files');

    res.status(200).json({ count: events.length, events });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

const joinEvent = async (req, res) => {
  try {
    const event = await EventRequest.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event topilmadi' });
    }

    if (event.status !== 'accepted') {
      return res.status(400).json({ message: 'Bu eventga qo\'shilish mumkin emas' });
    }

    const alreadyJoined = event.attendees.includes(req.user.id);
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Siz allaqachon qo\'shilgansiz' });
    }

    event.attendees.push(req.user.id);
    await event.save(); 

    res.status(200).json({
      message: 'Eventga qo\'shildingiz',
      attendees: event.attendees.length,
      peopleNeeded: event.peopleNeeded,
      status: event.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};



const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};





const getCharities = async (req, res) => {
  try {
    const charities = await CharityRequest.find({ status: 'accepted' })
      .populate('company', 'company_name')
      .select('-files -donors');

    res.status(200).json({ count: charities.length, charities });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

const donateToCharity = async (req, res) => {
  try {
    const { amount } = req.body;  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Pul miqdori noto\'g\'ri' });
    }

    const charity = await CharityRequest.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: 'Charity topilmadi' });
    }

    if (charity.status !== 'accepted') {
      return res.status(400).json({ message: 'Bu charityga yordam berish mumkin emas' });
    }

    charity.donors.push({ user: req.user.id, amount });
    charity.collectedAmount += amount;

    await charity.save();

    res.status(200).json({
      message: 'Rahmat! Yordam uchun payment linkga o\'ting',
      payment_link: charity.payment_link,
      collectedAmount: charity.collectedAmount,
      targetAmount: charity.targetAmount,
      remaining: Math.max(charity.targetAmount - charity.collectedAmount, 0),
      status: charity.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};


module.exports = { register, login, getEvents, joinEvent, getProfile, getCharities, donateToCharity };