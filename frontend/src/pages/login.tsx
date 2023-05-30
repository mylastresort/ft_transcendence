import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostLogin, PostTokens, PostVerify2fa } from './api/auth/auth';
import { Grid, Text, Spacer } from '@nextui-org/react';

const Styles = {
  body: {
    background: '#141414',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

function login({ setIsTwoFactorAuth }) {
  setIsTwoFactorAuth(true);
  const router = useRouter();
  const [Is2fa, setIs2fa] = useState(false);
  const [Code, setCode] = useState('');

  useEffect(() => {
    const QueryCode = window.location.search.split('code=')[1];
    if (QueryCode) {
      const url = `/api/auth/callback?access_code=${QueryCode}`;
      PostTokens(url)
        .then((res) => {
          if (res.status === 200) {
            PostLogin(res.body.accessToken)
              .then((res) => {
                if (res.body.twoFactorAuth) {
                  setIsTwoFactorAuth(true);
                  setIs2fa(true);
                  localStorage.setItem('TmpJwt', res.body.token);
                } else {
                  localStorage.setItem('jwtToken', res.body.token);
                  if (res.status === 201) {
                    window.location.href = '/home/dashboard';
                  }
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

  const HandleCode = (e) => {
    if (e.target.value.length === 6 && e.target.value.match(/^[0-9]+$/)) {
      const data = {
        code: e.target.value,
      };
      console.log(e.target.value);
      PostVerify2fa(data)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('jwtToken', res.body.token);
            window.location.href = '/home/dashboard';
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.target.value.match(/^[0-9]+$/)) {
      setCode(e.target.value);
    } else {
      setCode('');
    }
  };

  return (
    <Grid style={Styles.body}>
      {Is2fa ? (
        <Grid>
          <Text h1 style={{ color: '#fff' }}>
            Enter 2FA Code
          </Text>
          <Spacer y={1} />
          <input
            type="text"
            placeholder="2FA Code"
            onChange={(e) => HandleCode(e)}
            value={Code}
            style={{
              background: '#1f1f1f',
              border: 'none',
              color: '#fff',
              padding: '10px',
              borderRadius: '5px',
            }}
          />
        </Grid>
      ) : (
        <Grid>Not 2FA</Grid>
      )}
    </Grid>
  );
}

export default login;
