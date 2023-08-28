import { describe, expect, it } from "vitest";
import { Neboa } from "../../classes/neboa";
import { faker } from '@faker-js/faker';

describe('Query class', async () => {

  // Create a test database
  const neboa = new Neboa(':memory:');
  const Users = await neboa.collection('users');
  const Cars = await neboa.collection('cars');
  const Posts = await neboa.collection('posts');

  const usernames: any[] = [];

  // Seed the database
  await generateUsers(25, usernames, Users, Posts);
  await generateUsersWithCar(25, usernames, Users, Posts, Cars);

  it('Should find with equalTo', async () => {
    const query = Users.query()
      .equalTo('username', usernames[0]);
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].username).toBe(usernames[0]);
  })

  it('Should find with notEqualTo', async () => {
    const query = Users.query()
      .notEqualTo('username', usernames[0]);
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(49);
    expect(result[0].username).not.toBe(usernames[0]);
  });

  it('Should find with greaterThan', async () => {
    const query = Users.query()
      .greaterThan('age', 50);
    const result = query.find();
    expect(result).toBeDefined();

    // Check that all users are older than 50
    expect(result.every(user => user.age > 50)).toBe(true);
  });

  it('Should find with greaterThanOrEqualTo', async () => {
    const query = Users.query()
      .greaterThanOrEqualTo('age', 50);
    const result = query.find();
    expect(result).toBeDefined();

    // Check that all users are older than or equal to 50
    expect(result.every(user => user.age >= 50)).toBe(true);
  });

  it('Should find with lessThan', async () => {
    const query = Users.query()
      .lessThan('age', 50);
    const result = query.find();
    expect(result).toBeDefined();

    // Check that all users are younger than 50
    expect(result.every(user => user.age < 50)).toBe(true);
  });

  it('Should find with lessThanOrEqualTo', async () => {
    const query = Users.query()
      .lessThanOrEqualTo('age', 50);
    const result = query.find();
    expect(result).toBeDefined();

    // Check that all users are younger than or equal to 50
    expect(result.every(user => user.age <= 50)).toBe(true);
  });

  it('Should find with containedIn', async () => {
    const query = Users.query()
      .containedIn('username', usernames.slice(0, 10));
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
    expect(result.every(user => usernames.slice(0, 10).includes(user.username))).toBe(true);
  });

  it('Should find with notContainedIn', async () => {
    const query = Users.query()
      .notContainedIn('username', usernames.slice(0, 10));
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(40);
    expect(result.every(user => !usernames.slice(0, 10).includes(user.username))).toBe(true);
  });

  it('Should find with exists', async () => {
    const query = Users.query()
      .exists('carId');
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(25);
    expect(result.every(user => user.carId !== null)).toBe(true);
  });

  it('Should find with notExists', async () => {
    const query = Users.query()
      .notExists('carId');
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(25);
    expect(result.every(user => user.carId === null)).toBe(true);
  });

  it('Should find with matches', async () => {
    const query = Users.query();

    // Create a regex that matches only the first available username
    const regex = new RegExp(`^${usernames[0]}$`, 'i');
    query.matches('username', regex);

    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].username).toBe(usernames[0]);
  });

  it('Should find with doesNotMatch', async () => {
    const query = Users.query();

    // Create a regex that matches only the first available username
    const regex = new RegExp(`^${usernames[0]}$`, 'i');
    query.doesNotMatch('username', regex);

    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(49);
    expect(result[0].username).not.toBe(usernames[0]);
  });

  it('Should find with like', async () => {
    const query = Users.query()
      .like('username', usernames[0]);
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].username).toBe(usernames[0]);
  });

  it('Should include lookups', async () => {
    const query = Users.query()
      .lookup({
        from: 'posts',
        localField: 'postIds',
        foreignField: '_id',
        as: 'posts'
      });

    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(50);
    expect(result[0].posts.length).toBe(5);

    // Check that the posts are the correct ones
    expect(result[0].posts.every((post: any) => result[0].postIds.includes(post._id))).toBe(true);
  });

  it('Should limit the results', async () => {
    const query = Users.query()
      .limit(10);
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
  });

  it('Should skip the results', async () => {
    const query1 = Users.query()
      .limit(10);
    const result1 = query1.find();

    const query2 = Users.query()
      .skip(10);
    const result2 = query2.find();

    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
    expect(result1.length).toBe(10);
    expect(result2.length).toBe(40);
    // Check that the results are different
    expect(result1.every((user: any) => !result2.includes(user))).toBe(true);
  });

  it('Should return the first result', async () => {
    const result = Users.query()
      .first();
    expect(result).toBeDefined();
  });

  it('Should return the last result', async () => {
    const result = Users.query()
      .last();
    expect(result).toBeDefined();
  });

  it('Should sort the results (ascending)', async () => {
    const query = Users.query()
      .ascending('age');
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(50);
    expect(result.every((user: any, index: number) => index === 0 || user.age >= result[index - 1].age)).toBe(true);
  });

  it('Should sort the results (descending)', async () => {
    const query = Users.query()
      .descending('age');
    const result = query.find();
    expect(result).toBeDefined();
    expect(result.length).toBe(50);
    expect(result.every((user: any, index: number) => index === 0 || user.age <= result[index - 1].age)).toBe(true);
  });

});


async function generateUsers(number: number, usernames: string[], Users: any, Posts: any) {
  return Array.from({ length: 25 }, async () => {
    const newUser = generateUser();
    usernames.push(newUser.username);
    const user = await Users.insert(newUser);

    // Generate 5 posts for each user
    await Promise.all(Array.from({ length: 5 }, async () => {
      const newPost = generatePost();
      newPost.authorId = user._id;
      const post = await Posts.insert(newPost);
      user.postIds.push(post._id);
    }));
    await Users.update(user._id, user);
  });
}

async function generateUsersWithCar(number: number, usernames: string[], Users: any, Posts: any, Cars: any) {
  return Array.from({ length: 25 }, async () => {
    const newUser = generateUser();
    usernames.push(newUser.username);
    const user = await Users.insert(newUser);

    // Generate a car for each user
    const newCar = generateCar();
    newCar.ownerId = user._id;
    const car = await Cars.insert(newCar);
    user.carId = car._id;


    // Generate 5 posts for each user
    await Promise.all(Array.from({ length: 5 }, async () => {
      const newPost = generatePost();
      newPost.authorId = user._id;
      const post = await Posts.insert(newPost);
      user.postIds.push(post._id);
    }))
    await Users.update(user._id, user);
  });
}

function generateUser() {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ min: 18, max: 65 }),
    carId: null,
    postIds: []
  }
}

function generateCar() {
  return {
    make: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
    year: faker.date.past().getFullYear(),
    ownerId: null as null | string
  }
}

function generatePost() {
  return {
    title: faker.lorem.words(5),
    body: faker.lorem.paragraphs(3),
    authorId: null as null | string
  }
}
