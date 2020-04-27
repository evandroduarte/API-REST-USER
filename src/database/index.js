const mongoose = require('mongoose');

mongoose.connect(process.env.DB_AUTHSTRING, 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useFindAndModify: false}).catch(function (reason){
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;