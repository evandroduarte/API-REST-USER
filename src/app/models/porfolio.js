const mongoose = require('../../database/index');

const PortfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    photos_1: { 
        type: Object,
        required: true,
    },
    photos_2: {
        type: Object,
        required: true,
    },
});

const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;