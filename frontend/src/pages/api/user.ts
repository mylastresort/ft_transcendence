import request from 'superagent';

export const GetUserData = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get('http://localhost:4400/api/v1/user/me')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostUpdateProfile = (data: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('http://localhost:4400/api/v1/user/updateProfile')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
