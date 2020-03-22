const mongoose = require('mongoose');

mongoose.connect('mongodb://evandro:evandro123@site-ej-shard-00-00-q0i7q.gcp.mongodb.net:27017,site-ej-shard-00-01-q0i7q.gcp.mongodb.net:27017,site-ej-shard-00-02-q0i7q.gcp.mongodb.net:27017/test?ssl=true&replicaSet=site-ej-shard-0&authSource=admin&retryWrites=true&w=majority', 
{useNewUrlParser: true, 
useUnifiedTopology: true}).catch(function (reason){
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;