import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import { addUser } from '../../domain/use-case/add-user-use-case';
import { deleteUser } from '../../domain/use-case/delete-user-use-case';
import { getUserByEmail } from '../../domain/use-case/get-user-by-email-use-case';
import { getUser } from '../../domain/use-case/get-user-use-case';
import { updateUser } from '../../domain/use-case/update-user-use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      logger.info(
        `User API was called to add new User ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addUserResponse = await addUser(req.body);
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
      const updateUserResponse = await updateUser(req.body);
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
      const result = await getUser(parseInt(req.params.id, 10));

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // get existing user by email
  router.get('/email/:email', async (req, res, next) => {
    try {
      logger.info(
        `User API was called to get user by email ${req.params.email}`
      );
      const result = await getUserByEmail(req.params.email);

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
    await deleteUser(parseInt(req.params.id, 10));
    res.status(204).end();
  });

  expressApp.use('/user', router);
}
