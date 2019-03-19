const users = [
  {name: "ivan", age: 20},
  {name: "sergey", age: 30},
  {name: "artem", age: 40},
  {name: "yuriy", age: 50},
];

const u = user.find(_u => _u.name === 'artem');

const indexByName = {
  'artem': users[2],
  'ivan': users[0],
};

indexByName['artem']
