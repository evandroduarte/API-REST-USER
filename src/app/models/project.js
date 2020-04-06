const mongoose = require('../../database/index');

const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    image: {
        type: Object,
        require: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, //Metodo que o mongoose salva o usuario no db
        ref: 'User',                          //Referencia de qual model é a relaçao a ser usada
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;