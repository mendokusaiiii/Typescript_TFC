import { Router } from 'express';
import teamsRouter from './TeamsRouter';
import usersRouter from './UsersRouter';
import matchesRouter from './MatchesRouter';
import leaderboardRouter from './LeaderboardRouter';

const router = Router();

router.use('/login', usersRouter);
router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;
