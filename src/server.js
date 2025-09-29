const http = require('http');
const url = require('url');
const querystring = require('querystring');

const htmlHandler = require('./htmlResponses');
const users = require('./users');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const sendJSON = (response, status, obj) => {
  const body = JSON.stringify(obj);
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(body);
  response.end();
};

const handleGetUsers = (request, response) => {
  if (request.method === 'HEAD') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
    return;
  }

  if (request.method === 'GET') {
    const body = {
      users: users.getUsers(),
      message: 'Users retrieved successfully',
    };

    sendJSON(response, 200, body);
    return;
  }

  sendJSON(response, 405, { message: 'Method Not Allowed', id: 'methodNotAllowed' });
};

const handleNotReal = (request, response) => {
  if (request.method === 'HEAD') {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end();
    return;
  }

  if (request.method === 'GET') {
    sendJSON(response, 404, {
      message: 'The page you requested was not found',
      id: 'notFound',
    });
    return;
  }

  sendJSON(response, 405, { message: 'Method Not Allowed', id: 'methodNotAllowed' });
};

const handleAddUser = (request, response) => {
  if (request.method !== 'POST') {
    sendJSON(response, 405, { message: 'Method Not Allowed', id: 'methodNotAllowed' });
    return;
  }

  let bodyData = '';

  request.on('data', (chunk) => {
    bodyData += chunk;
  });

  request.on('end', () => {
    const params = querystring.parse(bodyData);
    const { name, age } = params;

    if (!name || !age) {
      sendJSON(response, 400, {
        message: 'Name and age are required',
        id: 'missingParams',
      });
      return;
    }

    if (users.userExists(name)) {
      users.updateUser(name, age);
      response.writeHead(204);
      response.end();
      return;
    }

    users.addUser(name, age);
    sendJSON(response, 201, { message: 'User created successfully' });
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;

  switch (path) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getUsers':
      handleGetUsers(request, response);
      break;
    case '/notReal':
      handleNotReal(request, response);
      break;
    case '/addUser':
      handleAddUser(request, response);
      break;
    default:

      sendJSON(response, 404, {
        message: 'The page you are looking for was not found',
        id: 'notFound',
      });
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Server listening on 127.0.0.1:${port}`);
});
