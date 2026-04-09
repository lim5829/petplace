const https = require('https');

const API_KEY = 'f479233845eb42f88e0d';
const BASE = 'https://www.foodsafetykorea.go.kr/api/' + API_KEY + '/COOKRST/json';

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  var start = req.query.start || '1';
  var end   = req.query.end   || '500';
  var petYn = req.query.petYn || 'Y';
  var url   = BASE + '/' + start + '/' + end + '?petYn=' + petYn;

  https.get(url, function(r) {
    var body = '';
    r.on('data', function(chunk) { body += chunk; });
    r.on('end', function() {
      try { res.status(200).json(JSON.parse(body)); }
      catch(e) { res.status(500).json({ error: 'parse error' }); }
    });
  }).on('error', function(err) {
    res.status(500).json({ error: err.message });
  });
};
