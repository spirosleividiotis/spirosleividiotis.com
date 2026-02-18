import crypto from 'crypto';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function toDateParts(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = pad2(d.getUTCMonth() + 1);
  const dd = pad2(d.getUTCDate());
  const HH = pad2(d.getUTCHours());
  const MM = pad2(d.getUTCMinutes());
  const SS = pad2(d.getUTCSeconds());
  return {
    yyyymmdd: `${yyyy}${mm}${dd}`,
    isoBasic: `${yyyy}${mm}${dd}T${HH}${MM}${SS}Z`,
    yyyy,
    mm
  };
}

function sha256Hex(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

function rfc3986Encode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function encodePath(path) {
  return path
    .split('/')
    .map(seg => rfc3986Encode(seg))
    .join('/');
}

function canonicalQuery(params) {
  return Object.keys(params)
    .sort()
    .map(k => `${rfc3986Encode(k)}=${rfc3986Encode(params[k])}`)
    .join('&');
}

function safeFileName(name) {
  const base = String(name || '').trim() || 'file';
  const last = base.split('/').pop().split('\\').pop();
  return last
    .normalize('NFKD')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '') || 'file';
}

function prefixForType(resourceType) {
  switch (resourceType) {
    case 'image':
      return 'portfolio/uploads/images';
    case 'video':
      return 'portfolio/uploads/video';
    case 'raw':
    default:
      return 'portfolio/uploads/raw';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const bucket = process.env.GCS_BUCKET;
  const saJson = process.env.GCS_SERVICE_ACCOUNT_JSON;
  if (!bucket) return json(res, 500, { error: 'GCS_BUCKET not configured' });
  if (!saJson) return json(res, 500, { error: 'GCS_SERVICE_ACCOUNT_JSON not configured' });

  let creds;
  try {
    creds = JSON.parse(saJson);
  } catch {
    return json(res, 500, { error: 'Invalid GCS_SERVICE_ACCOUNT_JSON (must be JSON)' });
  }
  if (!isObject(creds) || !creds.client_email || !creds.private_key) {
    return json(res, 500, { error: 'Service account JSON missing client_email/private_key' });
  }

  const body = isObject(req.body) ? req.body : {};
  const fileName = safeFileName(body.fileName);
  const contentType = String(body.contentType || 'application/octet-stream').trim() || 'application/octet-stream';
  const resourceType = String(body.resourceType || 'raw').trim();

  const { yyyymmdd, isoBasic, yyyy, mm } = toDateParts(new Date());
  const nonce = crypto.randomBytes(6).toString('hex');
  const objectPath =
    body.desiredPath && typeof body.desiredPath === 'string' && body.desiredPath.trim()
      ? body.desiredPath.trim().replace(/^\/+/, '')
      : `${prefixForType(resourceType)}/${yyyy}-${mm}/${Date.now()}-${nonce}-${fileName}`;

  const host = 'storage.googleapis.com';
  const canonicalUri = '/' + encodePath(`${bucket}/${objectPath}`);

  const credentialScope = `${yyyymmdd}/auto/storage/goog4_request`;
  const credential = `${creds.client_email}/${credentialScope}`;

  const signedHeaders = 'content-type;host';
  const queryParams = {
    'X-Goog-Algorithm': 'GOOG4-RSA-SHA256',
    'X-Goog-Credential': credential,
    'X-Goog-Date': isoBasic,
    'X-Goog-Expires': '600',
    'X-Goog-SignedHeaders': signedHeaders
  };
  const canonicalQueryString = canonicalQuery(queryParams);

  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\n`;
  const payloadHash = 'UNSIGNED-PAYLOAD';
  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n');

  const stringToSign = [
    'GOOG4-RSA-SHA256',
    isoBasic,
    credentialScope,
    sha256Hex(canonicalRequest)
  ].join('\n');

  let signatureHex;
  try {
    const sig = crypto.sign('RSA-SHA256', Buffer.from(stringToSign, 'utf8'), creds.private_key);
    signatureHex = sig.toString('hex');
  } catch (e) {
    return json(res, 500, { error: 'Failed to sign URL', details: e.message });
  }

  const uploadUrl = `https://${host}${canonicalUri}?${canonicalQueryString}&X-Goog-Signature=${signatureHex}`;
  const publicBase = (process.env.GCS_PUBLIC_BASE_URL || `https://storage.googleapis.com/${bucket}`).replace(/\/+$/, '');
  const publicUrl = `${publicBase}/${encodePath(objectPath)}`;

  return json(res, 200, {
    bucket,
    path: objectPath,
    uploadUrl,
    publicUrl,
    expiresInSeconds: 600
  });
}

