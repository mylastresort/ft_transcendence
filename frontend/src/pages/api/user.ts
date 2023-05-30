import request from 'superagent';

export const GetUserData = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get('http://localhost:4400/api/v1/users/me')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
