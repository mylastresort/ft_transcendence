import request from 'superagent';

export const PostUpload = (file: any) => {
  const data = new FormData();
  data.append('image', file);
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post('http://localhost:4400/api/v1/user/upload')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
