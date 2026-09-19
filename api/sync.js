// Vercel Serverless Function: CORS-enabled Zero-Auth Sync Proxy
// Handles cross-device JSON sync with ExtendsClass backend and proper CORS preflight

module.exports = async function handler(req, res) {
  // 1. Universal CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. Handle CORS Preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const MASTER_STORAGE = 'https://extendsclass.com/api/json-storage/bin/dafdaee';

  try {
    if (req.method === 'GET') {
      const pin = String(req.query.pin || '').trim();
      if (!pin) {
        return res.status(400).json({ error: 'PIN required' });
      }

      const remoteRes = await fetch(MASTER_STORAGE);
      if (!remoteRes.ok) {
        return res.status(502).json({ error: 'Storage upstream error' });
      }
      const registry = await remoteRes.json();
      return res.status(200).json({
        success: true,
        data: registry[pin] || null
      });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }

      const pin = String(body.pin || (body.data && body.data.syncPin) || '').trim();
      if (!pin) {
        return res.status(400).json({ error: 'PIN required' });
      }

      const remoteRes = await fetch(MASTER_STORAGE);
      let registry = {};
      if (remoteRes.ok) {
        try { registry = await remoteRes.json(); } catch (e) {}
      }

      registry[pin] = body.data || body;

      const putRes = await fetch(MASTER_STORAGE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry)
      });

      if (!putRes.ok) {
        return res.status(502).json({ error: 'Failed to update upstream storage' });
      }

      return res.status(200).json({ success: true, pin });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Sync API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
