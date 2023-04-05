import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import Matches from '../database/models/MatchesModel';

import { App } from '../app';
import {
  allMatchesModelMock,
  allMatchesList,
  inProgressMatchesModelMock,
  inProgressMatchesList,
  finishedMatchesModelMock,
  finishedMatchesList,
  newMatchBody,
  newMatchCreated,
  wrongMatchBody,
  updatedScoreboard,
  matchGoals,
} from './mocks/matchesMock';
import { invalidToken, validToken } from './mocks/tokenMock';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('Testa o endpoint /matches', () => {
  describe('Testa as respostas positivas', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Testa se retorna um status 200 com a lista de todas as partidas', async () => {
      sinon.stub(Matches, 'findAll').resolves(allMatchesModelMock as Matches[]);

      const response = await chai.request(app).get('/matches');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(allMatchesList);
    });

    it('Testa se a query retorna todas as partidas filtradas que estão acontecendo', async () => {
      sinon
        .stub(Matches, 'findAll')
        .resolves(inProgressMatchesModelMock as Matches[]);

      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(inProgressMatchesList);
    });

    it('Testa se a query retorna todas as partidas filtradas que estão finalizadas', async () => {
      sinon
        .stub(Matches, 'findAll')
        .resolves(finishedMatchesModelMock as Matches[]);

      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(finishedMatchesList);
    });

    it('Testa se o metodo POST cria uma nova partida', async () => {
      sinon.stub(Matches, 'create').resolves({ dataValues: newMatchCreated } as Matches);

      const response = await chai.request(app).post('/matches')
        .set('authorization', validToken)
        .send(newMatchBody);

      expect(response.status).to.equal(201);
      expect(response.body).to.deep.equal(newMatchCreated);
    });

    it('Testa se o metodo PATCH atualiza a partida para finalizada', async () => {
      sinon.stub(Matches, 'update').resolves();

      const response = await chai.request(app).patch('/matches/:id/finish');

      expect(response.status).to.equal(200);
      expect(response.body.message).to.deep.equal('Finished');
    });

    it('Testa se o metodo PATCH atualiza a partida que está em progresso', async () => {
      sinon.stub(Matches, 'update').resolves();

      const response = await chai.request(app).patch('/matches/:id').send(matchGoals);;

      expect(response.status).to.equal(200);
      expect(response.body.message).to.deep.equal(updatedScoreboard);
    });
  });

  describe('Testa as respostas negativas', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('Testa que não deve criar uma partida em que os dois times são iguais', async () => {
      const response = await chai.request(app).post('/matches')
        .set('authorization', validToken)
        .send(wrongMatchBody);

      expect(response.status).to.equal(422);
      expect(response.body.message).to.deep.equal('It is not possible to create a match with two equal teams');
    });

    it('Testa que não deve criar uma nova partida se o token for invalido', async () => {
      const response = await chai.request(app).post('/matches')
        .set('authorization', invalidToken)
        .send(newMatchBody);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.deep.equal('Token must be a valid token');
    });
  });
});