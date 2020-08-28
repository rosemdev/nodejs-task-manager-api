const Task = require('../src/models/task');
const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../src/app');
const {userOne, userOneId,setupDatabase, userTwo, userTwoId} = require('./fixtures/db');

const userOneTaskId = new mongoose.Types.ObjectId();
const userOneTaskTwoId = new mongoose.Types.ObjectId();

const testTask = {
    _id: userOneTaskId,
    description: 'test task description',
    completed: false,
    owner: userOneId
}

const secondTestTask = {
    _id: userOneTaskTwoId,
    description: 'Second test task description',
    completed: true,
    owner: userOneId
}


beforeEach(setupDatabase);
beforeEach(async()=> {
    await Task.deleteMany();
    await new Task(testTask).save();
    await new Task(secondTestTask).save();
});

test('Should create taks for user', async() => {
    const response = await request(app)
    .post('/task')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: "From test description",
        completed: false,
    }).expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.description).toEqual("From test description");
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

    const response = await request(app)
    .patch(`/tasks/${userOneTaskId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 555,
        completed: 'test'
    }).expect(400);

    const task = await Task.findById(userOneTaskId);
    expect(task.description).toEqual(testTask.description);
    expect(task.completed).toEqual(testTask.completed);
});

test('Should delete user task', async() => {
    
    const response = await request(app)
    .delete(`/tasks/${userOneTaskId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    const task = await Task.findById(userOneTaskId);
    
    expect(task).toBeNull();
    expect(response.body.description).toEqual(testTask.description)
});

test('Should not delete task if unauthenticated', async() => {
    
    const response = await request(app)
    .delete(`/tasks/${userOneTaskId}`)
    .expect(401);
});

test('Should not update other users task', async() => {
    
    const response = await request(app)
    .patch(`/tasks/${userOneTaskId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send({
        description: "new description",
        completed: true
    }).expect(404);
});

test('Should fetch user task by id', async() => {
    
    const response = await request(app)
    .get(`/tasks/${userOneTaskId}`)
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    const task = await Task.findById(userOneTaskId);
    expect(response.body.description).toEqual(task.description)
    expect(response.body.completed).toEqual(task.completed)
});

test('Should not fetch user task by id if unauthenticated', async() => {
    
    const response = await request(app)
    .get(`/tasks/${userOneTaskId}`)
    .expect(401);
});

test('Should not fetch other users task by id', async() => {
    
    const response = await request(app)
    .get(`/tasks/${userOneTaskId}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
});

test('Should fetch only completed tasks', async() => {
    
    const response = await request(app)
    .get('/tasks')
    .query({ completed: true })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].completed).toEqual(true);
});

test('Should fetch only incomplete tasks', async() => {
    
    const response = await request(app)
    .get('/tasks')
    .query({ completed: false })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].completed).toEqual(false);
});

test('Should fetch page of tasks', async() => {
    
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    expect(response.body).toHaveLength(2);
});