import request from 'superagent';

export const PostTokens = (url: string) => {
  return request
    .get(url)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostLogin = (AcToken: string) => {
  return request
    .post('http://localhost:4400/api/v1/auth/register')
    .set('Authorization', `Bearer ${AcToken}`)
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
    .get('http://localhost:4400/api/v1/auth/me')
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
    .post('http://localhost:4400/api/v1/auth/Get2fa')
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
  console.log(jwtToken);
  return request
    .post('http://localhost:4400/api/v1/auth/Verify2fa')
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
    .post('http://localhost:4400/api/v1/auth/Verify2faTmp')
    .set('Authorization', `Bearer ${TmpJwt}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
