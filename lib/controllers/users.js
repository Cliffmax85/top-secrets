const { Router } = require('express');
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', async (req, res, next) => {
      try {
          const user = await UserService.create(req.body);
          res.send(user);
      } catch (error) {
          next(error);
      }
  })
  
  .post('/sessions', async (req, res, next) => {
      try {
          const user = await UserService.signIn(req.body);

          res.cookie(process.env.COOKIE_NAME, user.authToken(), {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24
          }).send({
              message: 'Signed in successfully',
              user,
          });
      } catch (error) {
          next(error);
      }


  })
  
  .delete('/sessions', (req, res) => {
        res.clearCookie(process.env.COOKIE_NAME).send({ success: true, message: 'Signed out successfully' });
  
});
