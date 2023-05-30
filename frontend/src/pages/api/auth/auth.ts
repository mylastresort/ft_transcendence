import request from 'superagent';
import Cookies from 'js-cookie';

export const PostTokens = (url: string) => {
  const Token42 = localStorage.getItem('access_token');

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
  const Token42 = localStorage.getItem('access_token');

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
  const Token42 = localStorage.getItem('access_token');

  return request
    .get('http://localhost:4400/api/v1/auth/me')
    .set('Authorization', `Bearer ${Token42}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const Post2fa = (data: any) => {
  const Token42 = localStorage.getItem('access_token');

  return request
    .post('http://localhost:4400/api/v1/auth/Get2fa')
    .set('Authorization', `Bearer ${Token42}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
