import { ModelStatic } from 'sequelize';
import ITeams from '../interfaces/ITeams';
import Team from '../database/models/TeamsModel';

export default class TeamsService {
  constructor(
    private teamsModel: ModelStatic<Team> = Team,
  ) {}

  public async getAllTeams(): Promise<ITeams[]> {
    const teams = await this.teamsModel.findAll();

    const listOfTeams = teams.map((item) => item.dataValues);

    return listOfTeams;
  }

  public async getTeamsById(id: number): Promise<ITeams> {
    const team = await this.teamsModel.findOne({ where: { id } });

    return team?.dataValues;
  }
}
