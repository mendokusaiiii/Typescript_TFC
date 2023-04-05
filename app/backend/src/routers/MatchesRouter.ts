import { Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import { tokenValidation } from '../middlewares/validations';

const matchesRouter = Router();
const matchesController = new MatchesController();

matchesRouter.get('/', (req, res) => matchesController.getMatches(req, res));
matchesRouter.post('/', tokenValidation, (req, res) => matchesController.insertNewMatch(req, res));
matchesRouter.patch('/:id/finish', tokenValidation, (req, res) =>
  matchesController.updateMatchToFinished(req, res));
matchesRouter.patch('/:id', tokenValidation, (req, res) =>
  matchesController.updateMatchGoals(req, res));

export default matchesRouter;
