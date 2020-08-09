const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'mike',
    email: 'mike@example.com',
    password: 'qwerty123',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async() => {
    await User.deleteMany();
    await new User(userOne).save();

});

test('Should sign up a new user', async() => {
    const response = await request(app)
    .post('/users').send({
        name: 'Romanna',
        email: 'romasemenyshyn+4@gmail.com',
        password: 'qwerty123'
    }).expect(201)

    //Assert that the database was chnaged correctly

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response

    expect(response.body).toMatchObject({
        user: {
            name: 'Romanna',
            email: 'romasemenyshyn+4@gmail.com',
        },
        token: user.tokens[0].token
    })

    //Assert that the plain password not saved in the DB

    expect(user.password).not.toBe('qwerty123')

});

test('Should log in existing user', async() => {
    const response = await request(app)
    .post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    //Assert that new token is save to the DB

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);

})

test('Should not log non existing user', async() => {
    await request(app)
    .post('/users/login').send({
        email: userOne.email,
        password: 'testpassword'
    }).expect(400)
})

test('Should get a profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not get a profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should delete account for user', async() => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const user = await User.findById(userOneId);
        expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});


test('Should upload avatar image', async() => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});


test('Should update user profile', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({name: 'Johana'})
    .expect(200);


    const user = await User.findById(userOneId);
    expect(user.name).toBe('Johana');
});


test('Should not update user profile with non existing fileds', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'West Cost'})
    .expect(400);


    const user = await User.findById(userOneId);
    expect(user.name).not.toHaveProperty('location')
});