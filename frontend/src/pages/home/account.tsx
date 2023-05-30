import React, { useEffect, useState } from 'react';
import { Container, Card, Input, Checkbox } from '@mantine/core';
import { Text, Grid, Spacer, Avatar, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { GetUserData } from '@/pages/api/user';
import { Post2fa } from '@/pages/api/auth/auth';

function account() {
  const [UserData, setUserData] = useState<any>(null);
  const [Username, setUsername] = useState<string>('');
  const [is2fa, set2fa] = useState<boolean>(false);
  const [qr, setQr] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    GetUserData()
      .then((res) => {
        setUserData(res.body);
        setUsername(res.body.username);
        set2fa(res.body.twoFactorAuth);
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
                <Spacer y={0.5} />
                {is2fa && !Loading && (
                  <Grid>
                    <Image src={qr} />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Container>
    </Grid>
  );
}

export default account;
