import { ModelStatic, Op } from 'sequelize';
import IMatchesGoals from '../interfaces/IMatchesGoals';
import Errors from '../utils/error';
import Team from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import IMatches from '../interfaces/IMatches';

export default class MatchesService {
  constructor(
    private matchesModel: ModelStatic<Matches> = Matches,
    private teamsModel: ModelStatic<Team> = Team,
  ) {}

  public async getMatches(): Promise<string[]> {
    const findAllMatches = await this.matchesModel.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    const result = findAllMatches.map((item) => item.dataValues);

    return result;
  }

  public async getActualMatches(matchesStatus: string): Promise<string[]> {
    const matchesInProgress = matchesStatus === 'true';

    const findAllMatches = await this.matchesModel.findAll({
      where: { matchesInProgress },
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    const result = findAllMatches.map((item) => item.dataValues);

    return result;
  }

  public async insertNewMatch(match: IMatches): Promise<IMatches> {
    const { homeTeam, awayTeam } = match;

    if (homeTeam === awayTeam) {
      throw new Errors(422, 'It is not possible to create a match with two equal teams');
    }

    const { count } = await this.teamsModel.findAndCountAll({
      where: { [Op.or]: [{ id: homeTeam }, { id: awayTeam }] },
    });

    if (count !== 2) throw new Errors(404, 'There is no team with such id!');

    const insertedMatch = await this.matchesModel.create({ ...match, matchesInProgress: true });
    return insertedMatch.dataValues;
  }

  public async updateMatchToFinished(id: number): Promise<string> {
    await this.matchesModel.update(
      { matchesInProgress: false },
      { where: { id } },
    );

    return 'Finished';
  }

  public async updateMatchGoals(id: number, matchGoals: IMatchesGoals): Promise<string> {
    const { homeTeamGoals, awayTeamGoals } = matchGoals;

    await this.matchesModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );

    return `Updated Scoreboard: Home Team: ${homeTeamGoals} X Away Team: ${awayTeamGoals}`;
  }
}
