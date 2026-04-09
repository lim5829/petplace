const https = require('https');

// 카카오 로컬 API — 키워드 검색
// 외부 서버 접근 완전 허용, 한국 데이터 정확
const KAKAO_KEY = '1427278';
const KAKAO_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  var query = req.query.query || '반려동물 동반 음식점';
  var page  = req.query.page  || '1';
  var size  = req.query.size  || '15';
  var x     = req.query.x    || '';   // 경도
  var y     = req.query.y    || '';   // 위도
  var radius= req.query.radius|| '5000'; // 반경 5km

  var qs = 'query='    + encodeURIComponent(query)
         + '&page='   + page
         + '&size='   + size;

  if (x && y) {
    qs += '&x=' + x + '&y=' + y + '&radius=' + radius + '&sort=distance';
  }

  var options = {
    hostname: 'dapi.kakao.com',
    path: '/v2/local/search/keyword.json?' + qs,
    method: 'GET',
    headers: {
      'Authorization': 'KakaoAK ' + KAKAO_KEY
    }
  };

  var request = https.request(options, function(r) {
    var body = '';
    r.on('data', function(c) { body += c; });
    r.on('end', function() {
      try { res.status(200).json(JSON.parse(body)); }
      catch(e) { res.status(500).json({ error: 'parse error' }); }
    });
  });

  request.on('error', function(err) {
    res.status(500).json({ error: err.message });
  });

  request.end();
};
