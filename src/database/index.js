const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://evandro:evandro123@site-ej-q0i7q.gcp.mongodb.net/test?retryWrites=true&w=majority', 
{useNewUrlParser: true, 
useUnifiedTopology: true}).catch(function (reason){
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;