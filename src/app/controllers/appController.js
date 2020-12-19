const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

router.get('/dashboard', (req, res) => {
     res.send({
          ok: true,
          user: req.userId
     });
});

module.exports = app => app.use('/app', router);