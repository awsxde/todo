import { logger } from '@practica/logger';
import express from 'express';
import util from 'util';
import { addTodo } from '../../domain/use-case/add-user-use-case';
import { deleteTodo } from '../../domain/use-case/delete-user-use-case';
import { getTodo } from '../../domain/use-case/get-user-use-case';
import { updateTodo } from '../../domain/use-case/update-user-use-case';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      logger.info(
        `Todo API was called to add new Todo ${util.inspect(req.body)}`
      );
      // ✅ Best Practice: Using the 3-tier architecture, routes/controller are kept thin, logic is encapsulated in a dedicated domain folder
      const addTodoResponse = await addTodo(req.body);
      return res.json(addTodoResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  router.put('/', async (req, res, next) => {
    try {
      logger.info(
        `Todo API was called to update a Todo ${util.inspect(req.body)}`
      );
      const updateTodoResponse = await updateTodo(req.body);
      return res.json(updateTodoResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });

  // get existing todo by id
  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`Todo API was called to get todo by id ${req.params.id}`);
      const result = await getTodo(parseInt(req.params.id, 10));

      if (!result) {
        res.status(404).end();
        return;
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // delete todo by id
  router.delete('/:id', async (req, res) => {
    logger.info(`Todo API was called to delete todo ${req.params.id}`);
    await deleteTodo(parseInt(req.params.id, 10));
    res.status(204).end();
  });

  expressApp.use('/todo', router);
}
