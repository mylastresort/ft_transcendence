import React, { use, useEffect, useState } from 'react';
import { Container, Card, Input, Checkbox, Button, Tabs } from '@mantine/core';
import { Text, Grid, Spacer, Avatar, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { GetUserData, PostUpdateProfile } from '@/pages/api/user';
import { Post2fa, PostVerify2fa } from '@/pages/api/auth/auth';
import { PostUpload } from '@/pages/api/file';
import withAuth from '@/pages/lib/withAuth';

export function Account_Settings({ UserData }) {
  console.log(UserData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [UpdatedImage, setUpdatedImage] = useState(null);
  const [ProfileImage, setProfileImage] = useState(null);
  const [Username, setUsername] = useState<string>('');
  const [is2fa, set2fa] = useState<boolean>(false);
  const [qr, setQr] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(true);
  const [Code, setCode] = useState<string>('');
  const [verified2FA, setVerified2FA] = useState<boolean>(false);
  const [Error2FA, setError2FA] = useState<boolean>(false);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (UserData?.username) setUsername(UserData.username);
    if (UserData?.imgProfile) setProfileImage(UserData.imgProfile);
    if (UserData?.twoFactorAuth) set2fa(UserData.twoFactorAuth);
    if (UserData?.qrCodeUrl) setQr(UserData.qrCodeUrl);
    if (UserData?.is2fa) set2fa(UserData.is2fa);
    if (UserData?.verified2FA) setVerified2FA(UserData.verified2FA);
  }, [UserData]);

  const Handle2fa = (e: any) => {
    set2fa(e.currentTarget.checked);

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

  const handleImageChange = (event) => {
    if (event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
      setUpdatedImage(event.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const HandleSave = () => {
    if (UpdatedImage) {
      PostUpload(UpdatedImage).then((res) => {
        console.log(res);
      });
    }

    if (Username === UserData?.username && !Username) return;
    const data = {
      username: Username,
    };
    PostUpdateProfile(data).then((res) => {
      console.log(res);
    });
  };

  return (
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
            src={selectedImage ? selectedImage : ProfileImage}
            color="primary"
            bordered
            className={Styles.Upload_circle}
          />
          <input
            id="file-upload"
            type="file"
            onClick={handleClick}
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
            ref={inputRef}
            style={{ display: 'none' }}
          />
        </label>
        <Spacer y={1} />

        <Input.Wrapper label="username" required style={{ width: '100%' }}>
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
            <Grid>
              <Input
                size="md"
                placeholder="Enter 2FA code"
                error={Error2FA}
                onChange={(e) => HandleCode(e)}
              />
              <Spacer y={1} />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Button onClick={HandleSave}>Save</Button>
    </Grid>
  );
}
