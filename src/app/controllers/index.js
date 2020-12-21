const fs = require('fs');
const path = require('path');

// Exports all the files inside this folder (./src/app/controllers)
// except those starting with a period (.) or this very file index.js
module.exports = app => {
     fs.readdirSync(__dirname)
          .filter(file => ( (file.indexOf('.')) !== 0 && (file !== 'index.js') ))
          .forEach(file => require(path.resolve(__dirname, file))(app) );
};