const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const User = require('../lib/models/User');
const { agent } = require('supertest');

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
  });
  it('logs out a user', async () => {
        const res = await request(app)
        .delete('/api/v1/users/sessions');
  
        expect(res.body).toEqual({
          success: true,
          message: 'Signed out successfully'
    });
  });

  // it('allows a logged in user to create a secret', async () => {

  // })

  it('allows logged in users to view top secrets', async () => {
    const agent = request.agent(app);
    let res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(401);

    const expected = [
      {
        id: expect.any(String),
        title: 'Jim bob',
        description: 'Secret dude',
        createdAt: expect.any(String)
      },
      {
        id: expect.any(String),
        title: 'Fred',
        description: 'cant keep secrets',
        createdAt: expect.any(String)
      }
    ];

    await UserService.create({
      email: 'Jim Bob',
      password: 'Secret dude'
    });
    await agent.post('/api/v1/users/sessions').send({
      email: 'Jim Bob',
      password: 'Secret dude'
    });

    res = await agent
      .get('/api/v1/secrets');

    expect(res.body).toEqual(expected);
  });

  it('lets a user add a secret', async () => {
    const agent = request.agent(app);

    const expected = {
      id: expect.any(String),
      title: 'this is top secret',
      description: 'Ice cream is good',
      createdAt: expect.any(String)
    };

    let res = await agent
      .post('/api/v1/secrets')
      .send({
        title: 'this is top secret',
        description: 'Ice cream is good',
      });

    expect(res.status).toEqual(401);

    await agent
      .post('/api/v1/users')
      .send({
        email: 'Jim bob',
        password: 'Secret dude'
      });

    await agent
      .post('/api/v1/sessions')
      .send({
        email: 'Jim bob',
        password: 'Secret dude'
      });

    res = await agent
      .post('/api/v1/secrets')
      .send({
        title: 'this is top secret',
        description: 'Ice cream is good'
      });

    expect(res.body).toEqual(expected);
  })
});
