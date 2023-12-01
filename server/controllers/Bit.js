const models = require('../models');

const { Bit } = models;

const makerPage = async (req, res) => res.render('app');

const makeBit = async (req, res) => {
  if (!req.body.name || !req.body.message) {
    return res.status(400).json({ error: 'Name and message are required!' });
  }

  const bitData = {
    name: req.body.name,
    message: req.body.message,
    likes: req.body.likes,
    rebits: req.body.rebits,
    owner: req.session.account._id,
    date: req.session.createdDate,
  };

  try {
    const newBit = new Bit(bitData);
    await newBit.save();
    return res.status(201).json({ 
      name: newBit.name, message: newBit.message, date: newBit.message 
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Bit already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making bit!' });
  }
};

const getBits = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Bit.find(query).select('name message likes rebits owner date').lean().exec();

    return res.json({ bits: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving bits!' });
  }
};

module.exports = {
  makerPage,
  makeBit,
  getBits,
};
