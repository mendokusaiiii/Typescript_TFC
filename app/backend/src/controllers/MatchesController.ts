import { Request, Response } from 'express';
import MatchesService from '../services/MatchesService';

export default class MatchesController {
  constructor(private matchesService = new MatchesService()) {}

  public async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const result = await this.matchesService.getActualMatches(inProgress as string);

      return res.status(200).json(result);
    }

    const resultMatches = await this.matchesService.getMatches();

    return res.status(200).json(resultMatches);
  }

  public async insertNewMatch(req: Request, res: Response) {
    const result = await this.matchesService.insertNewMatch({ ...req.body });
    return res.status(201).json(result);
  }

  public async updateMatchToFinished(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.matchesService.updateMatchToFinished(Number(id));
    return res.status(200).json({ message: result });
  }

  public async updateMatchGoals(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.matchesService.updateMatchGoals(Number(id), req.body);
    return res.status(200).json({ message: result });
  }
}
