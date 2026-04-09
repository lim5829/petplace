const https = require('https');

const API_KEY = 'f479233845eb42f88e0d';
const BASE    = `https://www.foodsafetykorea.go.kr/api/${API_KEY}/COOKRST/json`;

module.exports = async function handler(req, res) {
  // CORS 헤더 — 앱인토스 WebView 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { start = 1, end = 500, petYn = 'Y' } = req.query;
  const url = `${BASE}/${start}/${end}?petYn=${petYn}`;

  try {
    const data = await get(url);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (r) => {
      let body = '';
      r.on('data', chunk => body += chunk);
      r.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('JSON 파싱 실패')); }
      });
    }).on('error', reject);
  });
}
