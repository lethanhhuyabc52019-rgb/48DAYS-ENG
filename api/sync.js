// Vercel Serverless Function: CORS-enabled Zero-Auth Sync Proxy
// Handles cross-device JSON sync with ExtendsClass backend and proper CORS preflight

module.exports = async function handler(req, res) {
  // 1. Universal CORS Headers & Anti-Cache Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cache-Control'
  );
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // 2. Handle CORS Preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const MASTER_STORAGE = 'https://extendsclass.com/api/json-storage/bin/dccfcbf';

  try {
    if (req.method === 'GET') {
      const pin = String(req.query.pin || '').trim();
      if (!pin) {
        return res.status(400).json({ error: 'PIN required' });
      }

      const remoteRes = await fetch(`${MASTER_STORAGE}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
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

      const remoteRes = await fetch(`${MASTER_STORAGE}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });
      let registry = {};
      if (remoteRes.ok) {
        try { registry = await remoteRes.json(); } catch (e) {}
      }

      const incoming = body.data || body;
      const existing = (registry[pin] && typeof registry[pin] === 'object') ? registry[pin] : {};

      // Server-side smart merge so no device ever overwrites the other's progress
      const merged = { ...existing, ...incoming };
      if (existing.userProgress && incoming.userProgress) {
        const units = new Set([
          ...(existing.userProgress.completedUnits || []),
          ...(incoming.userProgress.completedUnits || [])
        ]);
        merged.userProgress = {
          ...existing.userProgress,
          ...incoming.userProgress,
          completedUnits: Array.from(units).sort((a, b) => a - b),
          testScores: {
            ...(existing.userProgress.testScores || {}),
            ...(incoming.userProgress.testScores || {})
          }
        };
      }

      if (Array.isArray(existing.examHistory) || Array.isArray(incoming.examHistory)) {
        const historyMap = new Map();
        (existing.examHistory || []).forEach(item => {
          const key = item.attemptId || item.timestamp || JSON.stringify(item);
          historyMap.set(key, item);
        });
        (incoming.examHistory || []).forEach(item => {
          const key = item.attemptId || item.timestamp || JSON.stringify(item);
          historyMap.set(key, item);
        });
        merged.examHistory = Array.from(historyMap.values()).sort(
          (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
        );
      }

      registry[pin] = merged;

      const putRes = await fetch(MASTER_STORAGE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registry)
      });

      if (!putRes.ok) {
        return res.status(502).json({ error: 'Failed to update upstream storage' });
      }

      return res.status(200).json({ success: true, pin, data: merged });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Sync API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
