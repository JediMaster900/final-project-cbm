const models = require('../models');

const { Bit } = models;

const makerPage = async (req, res) => res.render('app');

const makeBit = async (req, res) => {
  if (!req.body.message) {
    return res.status(400).json({ error: 'A message is required!' });
  }

  const bitData = {
    name: req.session.account.username,
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
      name: newBit.name, message: newBit.message, date: newBit.message,
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
    // const query = { owner: req.session.account._id };
    const docs = await Bit.find().select('name message likes rebits owner createdDate').sort('-createdDate').lean()
      .exec();

    return res.json({ bits: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving bits!' });
  }
};

const likeBit = async (req, res) => {
  try {
    const bitId = req.body._id;
    console.log(req.session.account._id);

    const docs = await Bit.findByIdAndUpdate(bitId, { $inc: { likes: 1 } });
    await Bit.findByIdAndUpdate(bitId, { $push: { whoLiked: req.session.account._id } });

    return res.json({ liked: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error liking bit!' });
  }
};

const reBit = async (req, res) => {
  try {
    const docs = await Bit.findByIdAndUpdate(req.body._id, { $inc: { rebits: 1 } });

    return res.json({ rebited: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error rebiting bit!' });
  }
};

module.exports = {
  makerPage,
  makeBit,
  getBits,
  likeBit,
  reBit,
};
