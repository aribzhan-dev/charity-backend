const Company = require('../models/Company');
const EventRequest = require('../models/EventRequest');
const CharityRequest = require('../models/CharityRequest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const createEventRequest = async (req, res) => {
  try {
    const { title, description, date, location, peopleNeeded } = req.body;

    const transferDetails = req.body.transferDetails === 'true' ? true : false;


    if (req.user.type !== 'event') {
      return res.status(403).json({ message: 'Only event companies can send this' });
    }

    const files = req.files?.map(file => ({
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype
    })) || [];

    const eventRequest = await EventRequest.create({
      company: req.user.id,
      title,
      description,
      date,
      location,
      peopleNeeded,
      transferDetails,
      files
    });

    res.status(201).json({ message: 'Event request sent', eventRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCharityRequest = async (req, res) => {
  try {
    const { title, description, targetAmount, payment_link } = req.body;


    if (req.user.type !== 'charity') {
      return res.status(403).json({ message: 'Only charity companies can send this' });
    }

    const files = req.files?.map(file => ({
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype
    })) || [];

    const charityRequest = await CharityRequest.create({
      company: req.user.id,
      title,
      description,
      targetAmount,
      payment_link, 
      files
    });

    res.status(201).json({ message: 'Charity request sent', charityRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { company: req.user.id, ...(status && { status }) };

    const Model = req.user.type === 'event' ? EventRequest : CharityRequest;
    const requests = await Model.find(filter);

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createEventRequest, createCharityRequest, getMyRequests };