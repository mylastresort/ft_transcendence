import request from 'superagent';
import Cookies from 'js-cookie';

const Token42 = Cookies.get('access_token');

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
    .post('/api/v1/auth/register')
    .set('Authorization', `Bearer ${AcToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetMe = () => {
  return request
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${Token42}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
