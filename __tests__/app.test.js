const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'cliffy@cliff.com', password: 'securepassword' });

    expect(res.body).toEqual({ id: expect.any(String), email: 'cliffy@cliff.com'});
  })

  it('signs in a user', async () => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'puppy@dog.com',
      password: 'coolpassword',
    });

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({
        email: 'puppy@dog.com',
        password: 'coolpassword'
      });

    expect(res.body).toEqual({ 
      message: 'Signed in successfully',
      user, 
    });
  })
});
