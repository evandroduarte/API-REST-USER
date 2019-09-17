const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './uploads',
    rename: function (fieldname, filename) {
      return filename;
    },
   }));


require('./app/controllers/index')(app);

app.listen(3000);