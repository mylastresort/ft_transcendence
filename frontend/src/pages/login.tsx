import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PostLogin, PostTokens, PostVerify2faTmp } from './api/auth/auth';
import { Grid, Text, Spacer } from '@nextui-org/react';
import { Input } from '@mantine/core';
import withAuth from '@/pages/lib/withAuth';
import { Loading } from '@nextui-org/react';

const Styles = {
  body: {
    background: 'var(--body-color)',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

function login({ setIsTwoFactorAuth }) {
  setIsTwoFactorAuth(true);
function login({ setIsTwoFactorAuth }) {
  setIsTwoFactorAuth(true);
  const router = useRouter();
  const [Is2fa, setIs2fa] = useState(false);
  const [Code, setCode] = useState('');
  const [isError, setIsError] = useState(false);

  const [Is2fa, setIs2fa] = useState(false);
  const [Code, setCode] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const QueryCode = window.location.search.split('code=')[1];
    if (QueryCode) {
      const url = `/api/auth/callback?access_code=${QueryCode}`;
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
                    router.push('/home/dashboard');
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
      setCode(e.target.value);
      const data = {
        code: e.target.value,
      };
      PostVerify2faTmp(data)
        .then((res) => {
          if (res.status === 200) {
            localStorage.setItem('jwtToken', res.body.token);
            router.push('/home/dashboard');
          } else {
            setIsError(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (e.target.value.length < 6) {
      setCode(e.target.value);
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
          <Input
            type="text"
            placeholder="2FA Code"
            onChange={(e) => HandleCode(e)}
            value={Code}
            error={isError}
            color="dark"
          />
        </Grid>
      ) : (
        <Grid>
          <Loading color="primary" size="xl">
            <Text h3 style={{ color: '#fff' }}>
              Verifying...
            </Text>
          </Loading>
        </Grid>
      )}
    </Grid>
  );
}

export default withAuth(login);
export default withAuth(login);
