import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { usersValidation, tokenValidation } from '../middlewares/validations';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersValidation, (req, res) => usersController.users(req, res));
usersRouter.get('/role', tokenValidation, (req, res) => usersController.usersValidate(req, res));

export default usersRouter;
