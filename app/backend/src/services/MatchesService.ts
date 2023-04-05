import { ModelStatic, Op } from 'sequelize';
import IMatchesGoals from '../interfaces/IMatchesGoals';
import IMatches from '../interfaces/IMatches';
import Errors from '../utils/error';
import Team from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';

export default class MatchesService {
  constructor(
    private matchesModel: ModelStatic<Matches> = Matches,
    private teamsModel: ModelStatic<Team> = Team,
  ) {}

  public async getMatches(): Promise<string[]> {
    const findAllMatches = await this.matchesModel.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    console.log('AQUIIIIII', findAllMatches);

    const result = findAllMatches.map((item) => item.dataValues);

    return result;
  }

  public async getActualMatches(inProgressStatus : string): Promise<string[]> {
    const inProgress = inProgressStatus === 'true';

    const findAllMatches = await this.matchesModel.findAll({
      where: { inProgress },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });

    const result = findAllMatches.map((item) => item.dataValues);

    return result;
  }

  public async insertNewMatch(match: IMatches): Promise<IMatches> {
    const { homeTeamId, awayTeamId } = match;

    if (homeTeamId === awayTeamId) {
      throw new Errors(422, 'It is not possible to create a match with two equal teams');
    }

    const { count } = await this.teamsModel.findAndCountAll({
      where: { [Op.or]: [{ id: homeTeamId }, { id: awayTeamId }] },
    });

    if (count !== 2) throw new Errors(404, 'There is no team with such id!');

    const insertedMatch = await this.matchesModel.create({ ...match, inProgress: true });
    return insertedMatch.dataValues;
  }

  public async updateMatchToFinished(id: number): Promise<string> {
    await this.matchesModel.update(
      { inProgress: false },
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
