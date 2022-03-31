const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
//   .post('/', authenticate, async (req, res, next) => {
//       try {
//           const secret = await Secret.getSecrets();
        
//           res.send(secret);
//       } catch (error) {
//           next(error);
//       }
//   })

  .get('/', authenticate, async (req, res, next) => {
      try {
          console.log('HEEELP');
          const secret = await Secret.getSecrets();
          res.send(secret);
      } catch (error) {
          next(error);
      }
  });