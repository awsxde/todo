import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import { loginUser } from '../../domain/use-case/login-user-use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/login', async (req, res, next) => {
    try {
      logger.info(
        `User API was called to login as a User ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const loginUserResponse = await loginUser(req.body);
      return res.json(loginUserResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  expressApp.use('/auth', router);
}
