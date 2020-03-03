const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/portfolio/');
  },

  filename: function(req, file, cb) {
    cb(null, file.originalname);
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
          'Fromato de imagem inválido, utilize os formatos jpg, jpeg ou png!'
        ),
        false
      );
    }
  };

const upload = multer({ storage: storage, fileFilter: fileFilter });

const Portfolio = require('../models/porfolio');

const router = express.Router();

router.post('/', upload.array('photos', 2), async (req, res) => {
    const { name, description } = req.body;
  
    try {
      if (await Portfolio.findOne({ name }))
        return res.status(400).send({ error: 'Portfolio já cadastrado' });
  
      const photos = req.files;
  
      const portfolio = await Portfolio.create({ name, description, photos });
  
      return res.send({ portfolio });
    } catch (err) {
      return res.status(400).send({ error: 'Erro ao cadastrar o portfolio' });
    }
  });


module.exports = app => app.use('/portfolio', router);