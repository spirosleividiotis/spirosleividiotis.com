// Vercel Serverless Function — upload a file to the GitHub repo and return its raw URL

export default async function handler(req, res) {
    function json(status, body) {
        res.status(status).setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
    }

    if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = 'spirosleividiotis';
    const GITHUB_REPO  = 'spirosleividiotis.com';
    const BRANCH       = 'main';

    if (!GITHUB_TOKEN) return json(500, { error: 'GITHUB_TOKEN not configured' });

    const { fileName, fileBase64, contentType, subfolder } = req.body || {};
    if (!fileName || !fileBase64) return json(400, { error: 'fileName and fileBase64 are required' });

    // Sanitise filename
    const safe = String(fileName)
        .trim()
        .split('/').pop().split('\\').pop()
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '') || 'upload';

    const folder = subfolder ? String(subfolder).replace(/[^a-zA-Z0-9/_-]/g, '') : 'uploads';
    const timestamp = Date.now();
    const filePath = `${folder}/${timestamp}_${safe}`;

    // Check if file already exists (to get SHA if updating)
    let existingSha;
    const checkUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${BRANCH}`;
    const checkRes = await fetch(checkUrl, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-CMS'
        }
    });
    if (checkRes.ok) {
        const data = await checkRes.json();
        existingSha = data.sha;
    }

    // Commit file to GitHub
    const uploadUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    const body = {
        message: `Upload asset via CMS: ${safe}`,
        content: fileBase64,
        branch: BRANCH,
        ...(existingSha ? { sha: existingSha } : {})
    };

    const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Portfolio-CMS'
        },
        body: JSON.stringify(body)
    });

    if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        return json(500, { error: 'GitHub upload failed', details: err.message });
    }

    // Return the raw GitHub URL (available immediately, no redeploy needed)
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${filePath}`;

    return json(200, { path: filePath, url: rawUrl });
}
