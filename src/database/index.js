const mongoose = require('mongoose');

mongoose.connect('mongodb://dbEJCompAdmin:%216ejc%236532@191.252.113.79:27017/dbEJComp?authSource=dbEJComp', 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useFindAndModify: false}).catch(function (reason){
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;