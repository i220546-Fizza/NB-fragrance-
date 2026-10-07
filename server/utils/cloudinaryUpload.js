const crypto = require('crypto');

// Direct, hand-rolled signed upload to Cloudinary's REST API - deliberately
// NOT using the `cloudinary` npm package's uploader.upload_stream(). That
// SDK only reads/parses the response body when the HTTP status is one of
// [200, 400, 401, 404, 420, 429, 500] (see its lib/uploader.js); any other
// status - 403 included - is discarded unread and replaced with a generic
// "Server returned unexpected status code" error, hiding whatever Cloudinary
// actually said. Making the request ourselves means we always read and
// surface the real response body, whatever the status code.
async function uploadToCloudinary(buffer, { folder, filename, mimeType } = {}) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { timestamp, ...(folder ? { folder } : {}) };
  // Cloudinary's signing rule: alphabetically-sorted key=value pairs joined
  // with '&', with api_secret appended, SHA1-hashed to hex.
  const toSign = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join('&');
  const signature = crypto
    .createHash('sha1')
    .update(toSign + apiSecret)
    .digest('hex');

  const form = new FormData();
  form.append('file', new Blob([buffer], { type: mimeType || 'application/octet-stream' }), filename || 'upload');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  if (folder) form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const rawBody = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    parsed = null;
  }

  if (!response.ok || !parsed || !parsed.secure_url) {
    const detail = parsed?.error?.message || rawBody.slice(0, 1000) || '(empty response body)';
    const err = new Error(`Cloudinary upload failed - HTTP ${response.status}: ${detail}`);
    err.cloudinaryStatus = response.status;
    err.cloudinaryRawBody = rawBody.slice(0, 2000);
    throw err;
  }

  return parsed;
}

module.exports = { uploadToCloudinary };
