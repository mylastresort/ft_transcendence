import request from 'superagent';

export const GetUserData = () => {
  const Token42 = localStorage.getItem('access_token');
  return request
    .get('http://localhost:4400/api/v1/users/me')
    .set('Authorization', `Bearer ${Token42}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
