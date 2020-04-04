const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/members/');
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
        'Fromato de imagem inválido, utilize os formatos jpg, jpeg ou png!'
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const Member = require('../models/member');

const router = express.Router();

router.post('/', upload.single('avatar'), async (req, res) => {
  const {
    name,
    occupation
  } = req.body;

  try {
    if (await Member.findOne({
        name
      }))
      return res.status(400).send({
        error: 'Membro ja cadastrado'
      });

    const avatar = req.file;

    const member = await Member.create({
      name,
      occupation,
      avatar
    });

    return res.send({
      member
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao cadastrar o membro'
    });
  }
});

router.delete('/:memberId', async (req, res) => {
  try {
    await Member.findByIdAndRemove(req.params.memberId);

    return res.send();
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao deletar o membro'
    });
  }
});

router.put('/:memberId', upload.single('avatar'), async (req, res) => {
  const avatar = req.file;

  const {
    name,
    occupation
  } = req.body;

  await Member.findByIdAndUpdate(req.params.memberId, {
    name: name,
    occupation: occupation,
    avatar: avatar
  }, {
    new: true,
    runValidators: true
  }, (err, member) => {
    if (err) return res.status(500).send(err);
    return res.send(member);
  });
});

router.get('/:memberId', async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId);

    return res.send({
      member
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar o membro'
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const members = await Member.find();

    return res.send({
      members
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar os membros'
    });
  }
});

module.exports = app => app.use('/members', router);