const users = {
  // Example starter user
  example: {
    name: 'Example Name',
    age: 30,
  },
};

const getUsers = () => users;

const addUser = (name, age) => {
  users[name] = {
    name,
    age: Number(age),
  };
};

const updateUser = (name, age) => {
  if (users[name]) users[name].age = Number(age);
};

const userExists = (name) => !!users[name];

module.exports = {
  getUsers,
  addUser,
  updateUser,
  userExists,
};
