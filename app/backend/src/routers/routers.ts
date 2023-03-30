import { Router } from 'express';
import teamsRouter from './TeamsRouter';
import usersRouter from './UsersRouter';

const router = Router();

router.use('/login', usersRouter);
router.use('/teams', teamsRouter);

export default router;
