import request from 'superagent';

export const PostUpload = (file: any) => {
  const data = new FormData();
  data.append('image', file);
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('/api/v1/users/upload')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostLocalImg = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('/api/v1/users/updateProfileImg')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
