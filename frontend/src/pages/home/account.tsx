import React, { useEffect, useState } from 'react';
import { Container, Card, Input, Checkbox } from '@mantine/core';
import { Text, Grid, Spacer, Avatar, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { GetUserData } from '@/pages/api/user';
import { Post2fa, PostVerify2fa } from '@/pages/api/auth/auth';

function account() {
  const [UserData, setUserData] = useState<any>(null);
  const [Username, setUsername] = useState<string>('');
  const [is2fa, set2fa] = useState<boolean>(false);
  const [qr, setQr] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(true);
  const [Code, setCode] = useState<string>('');
  const [verified2FA, setVerified2FA] = useState<boolean>(false);
  const [Error2FA, setError2FA] = useState<boolean>(false);

  useEffect(() => {
    GetUserData()
      .then((res) => {
        setUserData(res.body);
        setUsername(res.body.username);
        set2fa(res.body.twoFactorAuth);
        setVerified2FA(res.body.verified2FA);
        const data = {
          twoFactorAuth: res.body.twoFactorAuth,
        };
        Post2fa(data)
          .then((res) => {
            if (res.body.qrCodeUrl) setQr(res.body.qrCodeUrl);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const Handle2fa = (e: any) => {
    set2fa(e.currentTarget.checked);
    if (e.currentTarget.checked) {
      const data = {
        twoFactorAuth: e.currentTarget.checked,
      };
      Post2fa(data)
        .then((res) => {
          setQr(res.body.qrCodeUrl);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const HandleCode = (e: any) => {
    if (e.target.value.length === 6 && e.target.value.match(/^[0-9]+$/)) {
      setCode(e.target.value);
      const data = {
        code: e.target.value,
        login: true,
      };
      console.log(e.target.value);
      PostVerify2fa(data)
        .then((res) => {
          if (res.status === 200) {
            set2fa(true);
            setVerified2FA(true);
          } else {
            setError2FA(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Grid className="dash_container">
      <Container size="xl">
        <Spacer y={4} />
        <Grid className={Styles.Account_layout}>
          <Text
            className="text"
            h2
            css={{
              fontSize: '30px',
              fontFamily: 'poppins',
              fontWeight: '500',
              color: '#fff',
            }}
          >
            Account
          </Text>
          <Spacer y={1} />
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              width: '80%',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Spacer y={1} />
            <Grid
              css={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '35%',
              }}
            >
              <Grid
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <label htmlFor="file-upload">
                  <Avatar
                    src={UserData?.imgProfile}
                    color="primary"
                    bordered
                    className={Styles.Upload_circle}
                  />
                  <input
                    id="file-upload"
                    type="file"
                    // onClick={handleClick}
                    // onChange={handleImageChange}
                    accept="image/jpeg, image/png"
                    // ref={inputRef}
                    style={{ display: 'none' }}
                  />
                </label>
                <Spacer y={1} />

                <Input.Wrapper
                  label="username"
                  required
                  style={{ width: '100%' }}
                >
                  <Input
                    size="md"
                    placeholder="Your usernname"
                    value={Username}
                    onChange={(e) => setUsername(e.currentTarget.value)}
                  />
                </Input.Wrapper>
              </Grid>
              <Spacer y={1} />
              <Grid
                css={{
                  display: 'flex',
                  justifyContent: 'left',
                  flexDirection: 'column',
                }}
              >
                <Checkbox
                  label="Enable Google 2FA"
                  checked={is2fa}
                  onChange={(e) => Handle2fa(e)}
                />
                <Grid>
                  <Spacer y={1} />
                  {is2fa && !verified2FA && !Loading && (
                    <Image src={qr} width={164} height={164} />
                  )}
                  <Spacer y={1} />
                  {!verified2FA && is2fa && (
                    <Input
                      size="md"
                      placeholder="Enter 2FA code"
                      error={Error2FA}
                      onChange={(e) => HandleCode(e)}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Container>
    </Grid>
  );
}

export default account;
