// Vercel Serverless Function to publish content.json to GitHub

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'No content provided' });
        }

        // GitHub API configuration
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = 'spirosleividiotis';
        const GITHUB_REPO = 'spirosleividiotis.com';
        const FILE_PATH = 'content.json';
        const BRANCH = 'main';

        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'GitHub token not configured' });
        }

        // Step 1: Get current file SHA (required for updates)
        const getFileUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
        const getResponse = await fetch(getFileUrl, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-CMS'
            }
        });

        if (!getResponse.ok) {
            throw new Error(`Failed to get file: ${getResponse.statusText}`);
        }

        const fileData = await getResponse.json();
        const currentSHA = fileData.sha;

        // Step 2: Update file with new content
        const contentBase64 = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
        
        const updateUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
        const updateResponse = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Portfolio-CMS'
            },
            body: JSON.stringify({
                message: `Update content via CMS - ${new Date().toISOString()}`,
                content: contentBase64,
                sha: currentSHA,
                branch: BRANCH
            })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Failed to update file: ${errorData.message}`);
        }

        const result = await updateResponse.json();

        return res.status(200).json({
            success: true,
            message: 'Content published successfully!',
            commit: result.commit.html_url
        });

    } catch (error) {
        console.error('Publish error:', error);
        return res.status(500).json({
            error: 'Failed to publish',
            details: error.message
        });
    }
}
