const config = require('./config');
console.log('JWT exists:', !!config.pinata.jwt);
console.log('Images path:', config.paths.images);
