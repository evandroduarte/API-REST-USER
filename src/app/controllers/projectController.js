const express = require('express');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/projects/');
  },

  filetitle: function (req, file, cb) {
    cb(null, file.originaltitle);
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
const Project = require('../models/project');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('user'); //Populate faz a query para carregar os usuarios que criaram os posts

    return res.send({
      projects
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar os posts'
    });
  }

});
router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('user');

    return res.send({
      project
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao listar o post'
    });
  }

});

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;

    const image = req.file;

    const project = await Project.create({
      title,
      description,
      image,
      user: req.userId
    }); //Alem de pegar o body da requisição precisa pegar o usuario que criou o post

    return res.send({
      project
    });
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao criar um novo post'
    });
  }

});

router.put('/:projectId', upload.single('image'), authMiddleware, async (req, res) => {
  const image = req.file;

  const {
    title,
    description
  } = req.body;

  await Project.findByIdAndUpdate(req.params.projectId, {
    title: title,
    description: description,
    image: image
  }, {
    new: true
  }, (err, project) => {
    if (err) return res.status(500).send(err);
    return res.send(project);
  });
});

router.delete('/:projectId', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId);

    return res.send();
  } catch (err) {
    return res.status(400).send({
      error: 'Erro ao deletar o post'
    });
  }

});

module.exports = app => app.use('/projects', router);