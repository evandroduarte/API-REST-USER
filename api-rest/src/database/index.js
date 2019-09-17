const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://evandro:evandro123@site-ej-q0i7q.gcp.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;