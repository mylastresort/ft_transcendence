import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PostLogin, PostTokens } from './api/auth/auth';

function login() {
  const router = useRouter();
  useEffect(() => {
    const QueryCode = window.location.search.split('code=')[1];
    if (QueryCode) {
      const url = `/api/auth/callback?access_code=${QueryCode}`;
      PostTokens(url)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('access_token', res.body.accessToken);
            localStorage.setItem('refresh_token', res.body.refreshToken);
            PostLogin(res.body.accessToken)
              .then((res) => {
                if (res.status === 201) {
                  window.location.href = '/home/dashboard';
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
