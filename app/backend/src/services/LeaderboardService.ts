import { ModelStatic } from 'sequelize';
import AllTeamsMatches from '../database/entities/AllTeamsMatches';
import ILeaderboard from '../interfaces/ILeaderboard';
import Match from '../database/models/MatchesModel';
import Team from '../database/models/TeamsModel';
import IMatches from '../interfaces/IMatches';
import ITeams from '../interfaces/ITeams';

export default class LeaderboardService {
  private _matchesList: IMatches[];
  private _teamMatches: IMatches[];
  private _teamsBoard: ILeaderboard[];

  constructor(
    private matchesModel: ModelStatic<Match> = Match,
    private teamsModel: ModelStatic<Team> = Team,
  ) {
    this._matchesList = [];
    this._teamMatches = [];
    this._teamsBoard = [];
  }

  private homeTeam(id: number) {
    const homeTeamMatches: IMatches[] = this._matchesList
      .filter((match) => id === match.homeTeamId);

    this._teamMatches = homeTeamMatches;
  }

  private awayTeam(id: number) {
    const awayTeamMatches: IMatches[] = this._matchesList
      .filter((match) => id === match.awayTeamId);

    this._teamMatches = awayTeamMatches;
  }

  private teamAllMatches(id: number) {
    const allMatches: IMatches[] = this._matchesList
      .filter((match) => id === match.homeTeamId || id === match.awayTeamId);

    this._teamMatches = allMatches;
  }

  private allTeamsMatches(team: ITeams, teamType: string) {
    const teamMatches = new AllTeamsMatches();
    teamMatches.generate(team, teamType, this._teamMatches);

    const data = {
      name: teamMatches._name,
      totalPoints: teamMatches._totalPoints,
      totalGames: teamMatches._totalGames,
      totalVictories: teamMatches._totalVictories,
      totalDraws: teamMatches._totalDraws,
      totalLosses: teamMatches._totalLosses,
      goalsFavor: teamMatches._goalsFavor,
      goalsOwn: teamMatches._goalsOwn,
      goalsBalance: teamMatches._goalsBalance,
      efficiency: teamMatches._efficiency,
    };

    return data;
  }

  private leaderboardListed() {
    const sort = [...this._teamsBoard]
      .sort((a, b) => b.goalsOwn - a.goalsOwn)
      .sort((a, b) => b.goalsFavor - a.goalsFavor)
      .sort((a, b) => b.goalsBalance - a.goalsBalance)
      .sort((a, b) => b.totalVictories - a.totalVictories)
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return sort;
  }

  public async getLeaderboard(teamType: string): Promise<ILeaderboard[]> {
    const matchesList = await this.matchesModel.findAll({
      where: { inProgress: false },
    });

    this._matchesList = matchesList.map((item) => item.dataValues);

    const teams = await this.teamsModel.findAll();
    const teamsList: ITeams[] = teams.map((item) => item.dataValues);

    const teamsBoard = teamsList.map((team) => {
      if (teamType === 'homeTeamId') { this.homeTeam(team.id); }
      if (teamType === 'awayTeamId') { this.awayTeam(team.id); }
      if (teamType === 'all') { this.teamAllMatches(team.id); }
      const data = this.allTeamsMatches(team, teamType);
      return data;
    });

    this._teamsBoard = teamsBoard;

    const leaderboard = this.leaderboardListed();
    return leaderboard;
  }
}
