import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import * as newUserUseCase from '../../domain/new-user-use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      logger.info(
        `User API was called to add new User ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addUserResponse = await newUserUseCase.addUser(req.body);
      return res.json(addUserResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  router.put('/', async (req, res, next) => {
    try {
      logger.info(
        `User API was called to update a User ${util.inspect(req.body)}`
      );
      const updateUserResponse = await newUserUseCase.updateUser(req.body);
      return res.json(updateUserResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing user by id
  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`User API was called to get user by id ${req.params.id}`);
      const result = await newUserUseCase.getUser(parseInt(req.params.id, 10));

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // get existing users
  router.get('/', async (req, res, next) => {
    try {
      logger.info(`User API was called to get users`);
      const result = await newUserUseCase.getUsers();

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete user by id
  router.delete('/:id', async (req, res) => {
    logger.info(`User API was called to delete user ${req.params.id}`);
    await newUserUseCase.deleteUser(parseInt(req.params.id, 10));
    res.status(204).end();
  });

  expressApp.use('/user', router);
}
