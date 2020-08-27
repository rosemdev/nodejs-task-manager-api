const Task = require('../src/models/task');
const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../src/app');
const {userOne, userOneId,setupDatabase} = require('./fixtures/db');

const testTaskId = new mongoose.Types.ObjectId();

const testTask = {
    _id: testTaskId,
    description: 'test task description',
    completed: false,
}


beforeEach(setupDatabase);

test('Should create taks for user', async() => {
    const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send(testTask).expect(201);

    const task = await Task.findById(testTaskId);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});

test('Should not create task with invalid description/completed', async() => {
    const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 555,
        completed: 'test'
    }).expect(400);
});

test('Should not update task with invalid description/completed', async() => {
    console.log(`/task/${testTaskId}`);
    
    const response = await request(app)
    .patch(`/tasks/${testTaskId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 555,
        completed: 'test'
    }).expect(400);

    const task = await Task.findById(testTaskId);
    expect(task.description).toEqual(testTask.description);
    expect(task.completed).toEqual(testTask.completed);
});