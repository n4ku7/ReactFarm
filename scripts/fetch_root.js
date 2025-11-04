const http = require('http');
const hosts = ['localhost', '127.0.0.1', '::1'];
const port = 3001;

function tryHost(idx) {
  if (idx >= hosts.length) return console.error('All hosts failed');
  const host = hosts[idx];
  const options = { hostname: host, port, path: '/', method: 'GET' };
  const req = http.request(options, res => {
    console.log('HOST:', host);
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', JSON.stringify(res.headers));
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n--- BODY START ---\n');
      console.log(data.slice(0, 2000)); // print first 2000 chars
      console.log('\n--- BODY END ---\n');
    });
  });
  req.on('error', err => {
    console.error('Request error for', host + ':', err && err.message ? err.message : err);
    tryHost(idx + 1);
  });
  req.end();
}

tryHost(0);
