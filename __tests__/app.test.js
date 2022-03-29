const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

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
});
