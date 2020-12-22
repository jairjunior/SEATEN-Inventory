const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

     const authHeader = req.headers.authorization;

     if( !authHeader )
          return res.status(401).send({ error: 'The access token must be provided.' });

     const parts = authHeader.split(' ');
     if(!parts.length === 2)
          return res.status(401).send({ error: 'Token error.' });

     const [ scheme, token ] = parts;
     if(! /^bearer$/i.test(scheme))
          return res.status(401).send({ error: 'Token malformatted.' });

     jwt.verify(token, process.env.APP_AUTH_HASH, (err, decoded) => {
          if(err) return res.status(401).send({ error: 'Invalid token.' });

          // After validate the token, the user id will be available as a result of the decryption
          // So it will be saved in the "req" variable to be used by the rest of the code.
          req.userId = decoded.id;
          return next();
     })

};