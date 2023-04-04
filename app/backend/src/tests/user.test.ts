import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import Users from '../database/models/UsersModel';

import { App } from '../app';

chai.use(chaiHttp);
const { app } = new App();
const { expect } = chai;

describe('Testa o endpoint /login', () => {
  describe('Testa se o retorno é OK', () => {
    beforeEach(async () => {
      sinon.stub(Users, 'findOne').resolves({
        dataValues: {
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'email@test.com',
          password:
            '$2a$12$L1YqVHk.DvVw722Ooo48wu6RF//RcWVmfqO20TrxOeoHDynS0qksm',
        }
      } as Users);
    });

    afterEach(() => {
      (Users.findOne as sinon.SinonStub).restore();
    });

    it('Testa se retornar um status 200 e um token ao logar', async () => {
      const response = await chai.request(app).post('/login').send({
        email: 'email@test.com',
        password: '123456',
      });

      expect(response.status).to.equal(200);
      expect(response.body.token).to.exist;
    });
  });

  describe('Testa os erros da rota /login', () => {
    beforeEach(async () => {
      sinon.stub(Users, 'findOne').resolves(null);
    });

    afterEach(() => {
      (Users.findOne as sinon.SinonStub).restore();
    });

    it('Testa que não deve funcionar se o email estiver faltando', async () => {
      const response = await chai.request(app).post('/login').send({
        password: '123456',
      });

      expect(response.status).to.be.equal(400);
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

    it('Testa que não deve funcionar se a senha estiver faltando', async () => {
      const response = await chai.request(app).post('/login').send({
        email: 'email@test.com',
      });

      expect(response.status).to.be.equal(400);
      expect(response.body.message).to.be.equal('All fields must be filled');
    });

    it('Testa que não deve funcionar se o email for invalido', async () => {
      const response = await chai.request(app).post('/login').send({
        email: 'invalid_email@test.com',
        password: '123456',
      });

      expect(response.status).to.be.equal(401);
      expect(response.body.message).to.be.equal('Invalid email or password');
    });

    it('Testa que não deve funcionar se a senha for invalida', async () => {
      const response = await chai.request(app).post('/login').send({
        email: 'email@test.com',
        password: 'invalid_password',
      });

      expect(response.status).to.be.equal(401);
      expect(response.body.message).to.be.equal('Invalid email or password');
    });
  });
});