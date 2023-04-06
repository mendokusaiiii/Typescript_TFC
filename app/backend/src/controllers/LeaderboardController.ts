import { Request, Response } from 'express';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  public async getLeaderboardHomeTeam(_req: Request, res: Response) {
    const result = await this.leaderboardService.getLeaderboard('homeTeamId');

    return res.status(200).json(result);
  }

  public async getLeaderboardAwayTeam(_req: Request, res: Response) {
    const result = await this.leaderboardService.getLeaderboard('awayTeamId');

    return res.status(200).json(result);
  }

  public async getLeaderboardAllMatches(_req: Request, res: Response) {
    const result = await this.leaderboardService.getLeaderboard('all');

    return res.status(200).json(result);
  }
}
