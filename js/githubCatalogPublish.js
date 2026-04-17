/**
 * Publicar data/products.json vía API REST de GitHub desde el navegador.
 * Requiere Personal Access Token (no la contraseña de la cuenta).
 */
(function (global) {
  const API = 'https://api.github.com';

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    bytes.forEach(b => {
      bin += String.fromCharCode(b);
    });
    return btoa(bin);
  }

  /**
   * @param {object} p
   * @param {string} p.owner
   * @param {string} p.repo
   * @param {string} p.branch
   * @param {string} p.path  ruta dentro del repo, ej. data/products.json
   * @param {string} p.token  PAT (classic: repo/public_repo) o fine-grained con Contents write
   * @param {string} p.jsonText  cuerpo UTF-8 del JSON
   * @param {string} [p.message]
   */
  async function putProductsJson(p) {
    const owner = String(p.owner || '').trim();
    const repo = String(p.repo || '').trim();
    const branch = String(p.branch || 'main').trim();
    const path = String(p.path || 'data/products.json').trim().replace(/^\/+/, '');
    const token = String(p.token || '').trim();
    const jsonText = p.jsonText;
    const message = String(p.message || 'Update products.json (Pacoustic web)').trim();

    if (!owner || !repo) throw new Error('Indica propietario (owner) y nombre del repositorio.');
    if (!token) throw new Error('Indica un token de acceso (PAT).');
    if (typeof jsonText !== 'string' || !jsonText.trim()) throw new Error('No hay JSON para subir.');

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };

    const pathEnc = path
      .split('/')
      .map(seg => encodeURIComponent(seg))
      .join('/');
    const baseUrl = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${pathEnc}`;

    let sha = null;
    const getUrl = `${baseUrl}?ref=${encodeURIComponent(branch)}`;
    const getRes = await fetch(getUrl, { method: 'GET', headers });
    if (getRes.status === 200) {
      const meta = await getRes.json();
      sha = meta.sha || null;
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      let msg = `GitHub GET ${getRes.status}`;
      try {
        const j = JSON.parse(errText);
        if (j.message) msg = j.message;
      } catch (_) {}
      throw new Error(msg);
    }

    const body = {
      message,
      content: utf8ToBase64(jsonText),
      branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(baseUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
    const putText = await putRes.text();
    if (!putRes.ok) {
      let msg = `GitHub PUT ${putRes.status}`;
      try {
        const j = JSON.parse(putText);
        if (j.message) msg = j.message;
      } catch (_) {}
      throw new Error(msg);
    }
    try {
      return JSON.parse(putText);
    } catch (_) {
      return { ok: true };
    }
  }

  global.PAcousticGithubPublish = { putProductsJson };
})(typeof window !== 'undefined' ? window : globalThis);
