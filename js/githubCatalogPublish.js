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
  function normRepoPart(s) {
    return String(s || '')
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.git$/i, '');
  }

  async function readJsonBody(res) {
    const t = await res.text();
    try {
      return JSON.parse(t);
    } catch (_) {
      return { message: t || res.statusText };
    }
  }

  async function putProductsJson(p) {
    const owner = normRepoPart(p.owner);
    const repo = normRepoPart(p.repo);
    const branch = normRepoPart(p.branch) || 'main';
    const path = normRepoPart(p.path) || 'data/products.json';
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

    const repoApi = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    const repoRes = await fetch(repoApi, { method: 'GET', headers });
    if (!repoRes.ok) {
      const j = await readJsonBody(repoRes);
      const gh = j && j.message ? String(j.message) : '';
      if (repoRes.status === 404) {
        throw new Error(
          'GitHub no encuentra el repositorio o tu token no tiene acceso (a veces también responde 404 por privacidad). ' +
            'Revisa: 1) Propietario = usuario u org exacto de la URL. 2) Nombre del repo sin .git. 3) Token classic con scope «repo»/«public_repo» o fine-grained con acceso a ESE repositorio y permiso Contents. ' +
            (gh ? `Detalle: ${gh}` : '')
        );
      }
      throw new Error(gh || `No se pudo comprobar el repo (${repoRes.status}).`);
    }

    const pathEnc = path
      .split('/')
      .filter(Boolean)
      .map(seg => encodeURIComponent(seg))
      .join('/');
    const baseUrl = `${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${pathEnc}`;

    let sha = null;
    const getUrl = `${baseUrl}?ref=${encodeURIComponent(branch)}`;
    const getRes = await fetch(getUrl, { method: 'GET', headers });
    if (getRes.status === 200) {
      const meta = await getRes.json();
      sha = meta.sha || null;
    } else if (getRes.status === 404) {
      // Archivo o rama inexistente en GET: puede ser rama mal escrita, o ruta distinta dentro del mono-repo.
      const repoMeta = await readJsonBody(
        await fetch(`${repoApi}/branches/${encodeURIComponent(branch)}`, { method: 'GET', headers })
      );
      if (repoMeta && repoMeta.message && String(repoMeta.message).toLowerCase().includes('not found')) {
        throw new Error(
          `La rama «${branch}» no existe en ${owner}/${repo} o el nombre no coincide (prueba «main» o «master»). ` +
            `Si el sitio está en una subcarpeta del repo, la ruta del JSON no es data/products.json sino por ejemplo Pacoustic/data/products.json.`
        );
      }
    } else {
      const j = await readJsonBody(getRes);
      throw new Error(j.message || `Error al leer el archivo (${getRes.status}).`);
    }

    const body = {
      message,
      content: utf8ToBase64(jsonText),
      branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(baseUrl, { method: 'PUT', headers, body: JSON.stringify(body) });
    const putJ = await readJsonBody(putRes);
    if (!putRes.ok) {
      let msg = putJ.message || `GitHub PUT ${putRes.status}`;
      if (putRes.status === 404 || String(msg).toLowerCase() === 'not found') {
        msg +=
          ' — Suele ser ruta del archivo dentro del repo incorrecta (ej. si GitHub tiene la carpeta Pacoustic arriba: Pacoustic/data/products.json) o rama incorrecta.';
      }
      throw new Error(msg);
    }
    return putJ && typeof putJ === 'object' ? putJ : { ok: true };
  }

  global.PAcousticGithubPublish = { putProductsJson };
})(typeof window !== 'undefined' ? window : globalThis);
