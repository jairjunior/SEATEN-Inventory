const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

     const authHeader = req.headers.authorization;
     console.log(authHeader);
     console.log(req.headers);
     //console.log('\n\n\n\n');

     if( !authHeader )
          return res.status(401).send({ error: 'No token provided (Unauthorized).' });

     const parts = authHeader.split(' ');
     if(!parts.length === 2)
          return res.status(401).send({ error: 'Token error (Unauthorized).' });

     const [ scheme, token ] = parts;
     if(! /^bearer$/i.test(scheme))
          return res.status(401).send({ error: 'Token malformatted (Unauthorized).' });

     jwt.verify(token, process.env.APP_AUTH_HASH, (err, decoded) => {
          if(err) return res.status(401).send({ error: 'Invalid token (Unauthorized).' });

          // After validate the token, the user id will be available as a result of the decryption
          // So it will be saved in the "req" variable to be used by the rest of the code.
          req.userId = decoded.id;
          return next();
     })

};