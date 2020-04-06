const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/portfolio/');
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Fromato de imagens inválido, utilize os formatos jpg, jpeg ou png!'
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const Portfolio = require('../models/porfolio');

const router = express.Router();

router.post('/', upload.array('photos', 2), authMiddleware,async (req, res) => {
  const {
    name,
    description
  } = req.body;

  try {
    if (await Portfolio.findOne({
        name
      }))
      return res.status(400).send({
        error: 'Portfolio já cadastrado'
      });

    const photos = req.files;

    const portfolio = await Portfolio.create({
      name,
      description,
      photos
    });

    return res.send({
      portfolio
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao cadastrar o portfolio'
    });
  }
});

router.delete('/:portfolioId', authMiddleware,async (req, res) => {
  try {
    await Portfolio.findByIdAndRemove(req.params.portfolioId);

    return res.send();
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao deletar o portfolio'
    });
  }
});

router.put('/:portfolioId', upload.array('photos', 2), authMiddleware, async (req, res) => {
  const newPhotos = req.files;

  const {
    name,
    description
  } = req.body;

  if (newPhotos) {
    await Portfolio.findByIdAndUpdate(req.params.portfolioId, {
      name: name,
      description: description,
      photos: newPhotos
    }, {
      new: true,
      runValidators: true
    }, (err, portfolio) => {
      if (err) return res.status(500).send(err);
      return res.send(portfolio);
    });
  } else {
    await Portfolio.findByIdAndUpdate(req.params.portfolioId, {
      name: name,
      description: description,
    }, {
      new: true,
      runValidators: true
    }, (err, portfolio) => {
      if (err) return res.status(500).send(err);
      return res.send(portfolio);
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.find();

    return res.send({
      portfolio
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar os portfolios'
    });
  }
});

router.get('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);

    return res.send({
      portfolio
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar o portfolio'
    });
  }
});


module.exports = app => app.use('/portfolio', router);