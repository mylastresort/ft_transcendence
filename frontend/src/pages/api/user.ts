import request from 'superagent';

export const GetUserData = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/users/me')
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
    .post(process.env.BACKEND_DOMAIN + '/api/v1/users/updateProfile')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const GetAvailableFriends = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/users/available-friends')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostUserProfile = (data: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/users/userProfile')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
