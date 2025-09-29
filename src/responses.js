const escapeXml = (str) => str.replace(/[<>&'"]/g, (c) => {
  switch (c) {
    case '<': return '&lt;';
    case '>': return '&gt;';
    case '&': return '&amp;';
    case '\'': return '&apos;';
    case '"': return '&quot;';
    default: return c;
  }
});

const respond = (request, response, status, payload) => {
  const accept = request.headers.accept || '';
  const wantsXML = accept.includes('text/xml');
  const wantsJSON = accept.includes('application/json');

  const useXML = !!(wantsXML && !wantsJSON);

  if (!useXML) {
    const body = JSON.stringify(payload);
    response.writeHead(status, { 'Content-Type': 'application/json' });
    console.log('Raw JSON response:', body);
    response.write(body);
    response.end();
    return;
  }

  let xml = '<response>';
  xml += `<message>${escapeXml(payload.message)}</message>`;
  if (payload.id) xml += `<id>${escapeXml(payload.id)}</id>`;
  xml += '</response>';

  response.writeHead(status, { 'Content-Type': 'text/xml' });
  console.log('Raw XML response:', xml);
  response.write(xml);
  response.end();
};

const success = (request, response) => {
  const payload = { message: 'This request was successful' };
  respond(request, response, 200, payload);
};

const badRequest = (request, response, query = {}) => {
  if (query.valid === 'true') {
    const payload = { message: 'This request has the required parameters' };
    respond(request, response, 200, payload);
    return;
  }

  const payload = { message: 'Missing valid query parameter set to true', id: 'badRequest' };
  respond(request, response, 400, payload);
};

const unauthorized = (request, response, query = {}) => {
  if (query.loggedIn === 'yes') {
    const payload = { message: 'You are logged in' };
    respond(request, response, 200, payload);
    return;
  }

  const payload = { message: 'Missing loggedIn query parameter set to yes', id: 'unauthorized' };
  respond(request, response, 401, payload);
};

const forbidden = (request, response) => {
  const payload = { message: 'You do not have access to this content', id: 'forbidden' };
  respond(request, response, 403, payload);
};

const internal = (request, response) => {
  const payload = { message: 'Internal Server Error. Something went wrong.', id: 'internal' };
  respond(request, response, 500, payload);
};

const notImplemented = (request, response) => {
  const payload = { message: 'A get request for this page has not been implemented yet', id: 'notImplemented' };
  respond(request, response, 501, payload);
};

const notFound = (request, response) => {
  const payload = { message: 'The page you are looking for was not found', id: 'notFound' };
  respond(request, response, 404, payload);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
