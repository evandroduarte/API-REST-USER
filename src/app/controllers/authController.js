const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/user');

const router = express.Router();

const authMiddleware = require('../middleware/auth');

function generateToken(params = {}) {
    return token = jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', authMiddleware,async (req, res) => {
    const {
        email
    } = req.body;

    try {
        if (await User.findOne({
                email
            }))
            return res.status(400).send({
                error: 'User already exists'
            })
        const user = await User.create(req.body); //await faz a criação ser realizada para continuar

        user.password = undefined;

        return res.send({
            user,
            token: generateToken({
                id: user.id
            }),
        });
    } catch (err) {
        return res.status(400).send({
            error: 'Registration failed'
        })
    }
});

router.post('/authenticate', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = await User.findOne({
        email
    }).select('+password'); // Dessa maneira msm o password estando com selec: false é possivel ser acessado

    if (!user)
        return res.status(400).send({
            error: 'User not found'
        });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({
            error: 'Invalid password'
        });

    user.password = undefined;

    res.send({
        user,
        token: generateToken({
            id: user.id
        })
    });
});

router.get('/', authMiddleware,async (req, res) => {
    try {
      const users = await User.find();
  
      return res.send({
        users
      });
    } catch (err) {
      return res.status(400).send({
        error: 'Erro ao listar os usuários'
      });
    }
  });


router.post('/forgot_password', async (req, res) => {
    const {
        email
    } = req.body;

    try {
        const user = await User.findOne({
            email
        }); //função para procurar o email digitado no banco

        if (!user)
            return res.status(400).send({
                error: 'User not found'
            });

        const token = crypto.randomBytes(20).toString('hex'); //Cria um token de 20 caracteres em hexadecimal para a sessao de recuperação de senha

        const now = new Date();
        now.setHours(now.getHours() + 1); //Pega a hora em que o token foi criado e coloca a expiração da hora atual + 1

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

        mailer.sendMail({
            to: email,
            from: 'duarte.evandro@gmail.com',
            template: 'auth/forgot_password',
            context: {
                token
            },
        }, (err) => {
            if (err)
                return res.status(400).send({
                    error: 'Cannot send forgot password email'
                });


            return res.send();
        });

    } catch (err) {
        console.log(err);
        res.status(400).send({
            error: 'Error on forgot password'
        });
    }
});


router.post('/reset_password', async (req, res) => {
    const {
        email,
        token,
        password
    } = req.body;

    try {
        const user = await User.findOne({
                email
            })
            .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(400).send({
                error: 'User not found'
            });

        if (token !== user.passwordResetToken)
            return res.status(400).send({
                error: 'Invalid token'
            });

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(400).send({
                error: 'Token has expired'
            });

        user.password = password;

        await user.save();

        res.send();

    } catch (err) {
        res.send(400).send({
            error: 'Cannot reset password'
        });

    }
});

router.delete('/:userId', async (req, res) => {
    try {
      await User.findByIdAndRemove(req.params.userId);
  
      return res.send();
    } catch (err) {
      return res.status(400).send({
        error: 'Erro ao deletar o usuario!'
      });
    }
  });

module.exports = app => app.use('/auth', router);