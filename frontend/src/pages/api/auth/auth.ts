import request from 'superagent';

export const PostTokens = (access_code) => {
  return request
    .post('https://api.intra.42.fr/oauth/token')
    .send({
      grant_type: 'authorization_code',
      client_id: process.env.FORTYTWO_CLIENT_ID,
      client_secret: process.env.FORTYTWO_CLIENT_SECRET,
      code: access_code,
      redirect_uri: `${process.env.FRONTEND_DOMAIN}/login`,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const PostLogin = (payload) => {
  return request
    .post('/api/v1/auth/register')
    .send(payload)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetMe = () => {
  const jwtToken = localStorage.getItem('jwtToken');

  return request
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const Post2fa = (data: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('/api/v1/auth/Get2fa')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostVerify2fa = (data: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('/api/v1/auth/Verify2fa')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostVerify2faTmp = (data: any) => {
  const TmpJwt = localStorage.getItem('TmpJwt');
  return request
    .post('/api/v1/auth/Verify2faTmp')
    .set('Authorization', `Bearer ${TmpJwt}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
