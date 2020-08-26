const Taks = require('../src/models/task');
const request = require('supertest');
const app = require('../src/app');
const {userOne, userOneId,setupDatabase} = require('./fixtures/db');
const Task = require('../src/models/task');


beforeEach(setupDatabase);

test('Should create taks for user', async() => {
    const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test',
    }).expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});