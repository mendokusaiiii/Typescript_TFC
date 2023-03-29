import * as sinon from "sinon";
import * as chai from "chai";
// @ts-ignore
import chaiHttp = require("chai-http");
import Team from '../database/models/TeamsModel';

import { App } from '../app';
import { singleTeam, teamsList, modelMock } from './mocks/teamsMock';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('Testa o endpoint /teams', () => {
    beforeEach(async () => {
      sinon.stub(Team, 'findAll').resolves(modelMock as Team[]);
      sinon.stub(Team, 'findOne').resolves({
        dataValues: singleTeam,
      } as Team);
    });

    afterEach(() => {
      (Team.findAll as sinon.SinonStub).restore();
      (Team.findOne as sinon.SinonStub).restore();
    });

    it('Testa se retorna um um status 200 com a lista dos times', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(teamsList);
    });

    it('Testa se retorna um status 200 ao selecionar pelo id', async () => {
      const response = await chai.request(app).get('/teams/:id');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(singleTeam);
    });
  });