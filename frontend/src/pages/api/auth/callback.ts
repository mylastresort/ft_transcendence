import { NextApiRequest, NextApiResponse } from 'next';

let accessToken = '';
let refreshToken = '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  const { access_code } = req.query;

  if (code) res.redirect(`/login?code=${code}`);
  else if (access_code) {
    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.FORTYTWO_CLIENT_ID,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET,
        code: access_code,
        redirect_uri: 'http://10.13.1.7:3000/api/auth/callback',
      }),
    });
    const data = await response.json();
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    if (data.error) res.status(400).json({ error: data.error });
    else res.status(200).json({ accessToken, refreshToken });
  } else {
    res.status(400).json({ error: 'No code or access_code' });
  }
}
