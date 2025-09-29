const fs = require('fs');
const path = require('path');

const index = fs.readFileSync(path.resolve(__dirname, '..', 'client', 'client.html'));
const style = fs.readFileSync(path.resolve(__dirname, '..', 'client', 'style.css'));

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
};
