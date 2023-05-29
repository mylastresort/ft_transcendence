import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { PostLogin, PostTokens } from './api/auth/auth';

function login() {
  const router = useRouter();
  useEffect(() => {
    const QueryCode = window.location.search.split('code=')[1];
    if (QueryCode) {
      const url = `/api/v1/auth/42/callback?access_code=${QueryCode}`;
      PostTokens(url)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            Cookies.set('access_token', res.body.accessToken);
            Cookies.set('refresh_token', res.body.refreshToken);
            PostLogin(res.body.accessToken)
              .then((res) => {
                if (res.status === 201) {
                  router.push('/home/dashboard');
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return <div></div>;
}

export default login;
