import ITeams from '../../interfaces/ITeams';
import IMatches from '../../interfaces/IMatches';

export default class TeamMatchesData {
  _name: string;
  _totalPoints: number;
  _totalGames: number;
  _totalVictories: number;
  _totalDraws: number;
  _totalLosses: number;
  _goalsFavor: number;
  _goalsOwn: number;
  _goalsBalance: number;
  _efficiency: number;

  constructor() {
    this._name = '';
    this._totalPoints = 0;
    this._totalGames = 0;
    this._totalVictories = 0;
    this._totalDraws = 0;
    this._totalLosses = 0;
    this._goalsFavor = 0;
    this._goalsOwn = 0;
    this._goalsBalance = 0;
    this._efficiency = 0;
  }

  private win() {
    this._totalPoints += 3;
    this._totalVictories += 1;
  }

  private loss() {
    this._totalLosses += 1;
  }

  private draw() {
    this._totalPoints += 1;
    this._totalDraws += 1;
  }

  private gols(teamType: string, homeTeamGoals: number, awayTeamGoals: number) {
    if (teamType === 'homeTeamId') {
      this._goalsFavor += homeTeamGoals;
      this._goalsOwn += awayTeamGoals;
    }
    if (teamType === 'awayTeamId') {
      this._goalsFavor += awayTeamGoals;
      this._goalsOwn += homeTeamGoals;
    }
  }

  private goalsBalance() {
    this._goalsBalance = (this._goalsFavor - this._goalsOwn);
  }

  private efficiency() {
    this._efficiency = Number(((this._totalPoints / (this._totalGames * 3)) * 100).toFixed(2));
  }

  private homeTeamGols(matches: IMatches[]) {
    matches.forEach((match) => {
      const { homeTeamGoals, awayTeamGoals } = match;
      if (homeTeamGoals > awayTeamGoals) {
        this.win();
        this.gols('homeTeamId', homeTeamGoals, awayTeamGoals);
      }
      if (homeTeamGoals === awayTeamGoals) {
        this.draw();
        this.gols('homeTeamId', homeTeamGoals, awayTeamGoals);
      }
      if (homeTeamGoals < awayTeamGoals) {
        this.loss();
        this.gols('homeTeamId', homeTeamGoals, awayTeamGoals);
      }
    });
  }

  private awayTeamGols(matches: IMatches[]) {
    matches.forEach((match) => {
      const { homeTeamGoals, awayTeamGoals } = match;
      if (homeTeamGoals < awayTeamGoals) {
        this.win();
        this.gols('awayTeamId', homeTeamGoals, awayTeamGoals);
      }
      if (homeTeamGoals === awayTeamGoals) {
        this.draw();
        this.gols('awayTeamId', homeTeamGoals, awayTeamGoals);
      }
      if (homeTeamGoals > awayTeamGoals) {
        this.loss();
        this.gols('awayTeamId', homeTeamGoals, awayTeamGoals);
      }
    });
  }

  private allTeamMatches(id: number, matches: IMatches[]) {
    matches.forEach((match) => {
      if (match.homeTeamId === id) { this.homeTeamGols([match]); }
      if (match.awayTeamId === id) { this.awayTeamGols([match]); }
    });
  }

  public async generate(team: ITeams, teamType: string, matches: IMatches[]) {
    const { teamName, id } = team;
    this._name = teamName;
    this._totalGames = matches.length;

    if (teamType === 'homeTeamId') { this.homeTeamGols(matches); }
    if (teamType === 'awayTeamId') { this.awayTeamGols(matches); }
    if (teamType === 'all') { this.allTeamMatches(id, matches); }

    this.goalsBalance();
    this.efficiency();
  }
}
