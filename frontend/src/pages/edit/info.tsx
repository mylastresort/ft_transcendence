import React, { use, useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Button,
  Flex,
  Grid,
  Image,
  Group,
  Text,
  Indicator,
  ThemeIcon,
  Center,
  ActionIcon,
  Menu,
  Avatar,
  Tabs,
  UnstyledButton,
  Anchor,
  Divider,
  NavLink,
  Box,
  Input,
  Checkbox,
  Select,
  Textarea,
  FileButton,
} from '@mantine/core';
import { Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { GetMe } from '@/pages/api/auth/auth';
import { HiEmojiSad } from 'react-icons/hi';
import Styles from './info.module.css';
import { GetUserData, PostUpdateProfile } from '@/pages/api/user';
import { PostUpload, PostLocalImg } from '@/pages/api/file';
import { Post2fa, PostVerify2fa } from '@/pages/api/auth/auth';

const data = [
  {
    label: 'General',
  },
  {
    label: 'Avatar',
  },
  { label: 'Security' },
];

function SideLink({ active, setActive }) {
  const items = data.map((item, index) => (
    <NavLink
      style={{ borderRadius: '5px' }}
      color="cyan"
      key={item.label}
      active={index === active}
      label={item.label}
      onClick={() => setActive(index)}
    />
  ));

  return <div>{items}</div>;
}

function General() {
  const [UserData, setUserData] = useState<any>(null);
  const [Username, setUsername] = useState<string>('');
  const [FirstName, setFirstName] = useState<string>('');
  const [LastName, setLastName] = useState<string>('');
  const [Country, setCountry] = useState<string | null>(null);
  const [Summary, setSummary] = useState<string>('');

  useEffect(() => {
    GetMe()
      .then((res) => {
        console.log(res);
        setUserData(res.body);
        setUsername(res.body.username);
        setFirstName(res.body.firstName);
        setLastName(res.body.lastName);
        setCountry(res.body.location);
        setSummary(res.body.sammary);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const HandleUpdateProfile = () => () => {
    if (
      Username !== '' &&
      Username.length < 10 &&
      FirstName !== '' &&
      FirstName.length < 10 &&
      LastName !== '' &&
      LastName.length < 10 &&
      Summary !== '' &&
      Summary.length < 150
    ) {
      const payload = {
        username: Username,
        firstName: FirstName,
        lastName: LastName,
        location: Country,
        summary: Summary,
      };
      PostUpdateProfile(payload)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert('Please fill all the fields');
    }
  };

  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          ABOUT
        </Text>
        <Text size="1rem" weight={400}>
          Set your profile name and details. Providing additional information
          like your real name can help friends find you on the PingPong
          Community.
        </Text>
        <Text size="1rem" weight={400}>
          Your profile name and avatar represent you throughout PingPong, and
          must be appropriate for all audiences. Please see the
        </Text>
        <Spacer y={0.3} />

        <Text size="1.3rem" weight={400}>
          GENERAL
        </Text>
        <Divider />
        <Spacer y={0.1} />
        <Input.Wrapper
          withAsterisk
          label="PROFILE NAME"
          error={
            Username.length > 10
              ? 'Your username is more than 10 character'
              : ''
          }
        >
          <Input
            value={Username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </Input.Wrapper>
        <Input.Wrapper
          label="FIRST NAME"
          error={
            FirstName.length > 10
              ? 'Your first name is more than 10 character'
              : ''
          }
        >
          <Input
            value={FirstName}
            onChange={(e) => {
              setFirstName(e.currentTarget.value);
            }}
          />
        </Input.Wrapper>
        <Input.Wrapper
          label="LAST NAME"
          error={
            LastName.length > 10
              ? 'Your last name is more than 10 character'
              : ''
          }
        >
          <Input
            value={LastName}
            onChange={(e) => {
              setLastName(e.currentTarget.value);
            }}
          />
        </Input.Wrapper>
        <Spacer y={0.3} />

        <Text size="1.3rem" weight={400}>
          LOCATION
        </Text>
        <Divider />
        <Spacer y={0.1} />

        <Select
          label="COUNTRY"
          placeholder="(Do Not Display)"
          value={Country}
          onChange={setCountry}
          data={[
            { value: 'Morocco', label: 'Morocco' },
            { value: 'United State', label: 'United State' },
            { value: 'United Kingdom', label: 'United Kingdom' },
            { value: 'Spain', label: 'Spain' },
          ]}
        />
        <Spacer y={0.3} />

        <Text size="1.3rem" weight={400}>
          SUMMARY
        </Text>
        <Divider />
        <Spacer y={0.1} />
        <Textarea
          placeholder="No information given."
          radius="xs"
          size="md"
          value={Summary}
          onChange={(e) => {
            setSummary(e.currentTarget.value);
          }}
          error={
            Summary.length > 150
              ? 'Your summary is more than 100 character'
              : ''
          }
        />
      </Stack>
      <Group position="right">
        <Button
          variant="filled"
          color="gray"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
          onClick={() => {
            setUsername(UserData.username);
            setFirstName(UserData.firstName);
            setLastName(UserData.lastName);
            setCountry(UserData.location);
            setSummary(UserData.sammary);
          }}
        >
          CANCEL
        </Button>
        <Button
          variant="light"
          color="cyan"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
          onClick={HandleUpdateProfile()}
        >
          SAVE
        </Button>
      </Group>
    </Flex>
  );
}

function UserAvatar() {
  const [UserData, setUserData] = useState<any>(null);
  const [ProfileImg, setProfileImg] = useState<any>(null);
  const [SelectedImg, setSelectedImg] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    GetMe()
      .then((res) => {
        setUserData(res.body);
        setProfileImg(res.body.imgProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (file && file.size < 4 * 1024 * 1024) {
      setProfileImg(URL.createObjectURL(file));
    } else if (file) {
      window.alert('Please choose a image less than 4MB');
    }
  }, [file]);

  const HandleSelectedImg = (img) => () => {
    setSelectedImg(img);
    setProfileImg(img);
  };

  const HandleUpdateProfile = () => () => {
    if (file) {
      PostUpload(file).then((res) => {
        console.log(res);
      });
    } else if (!file && SelectedImg) {
      const payload = {
        imgProfile: ProfileImg,
      };
      PostLocalImg(payload)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert('Please choose a image');
    }
  };

  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Stack spacing={3}>
          <Text size="1.7rem" weight={400}>
            AVATAR
          </Text>
          <Text size="1rem" weight={400}>
            Choose your avatar image
          </Text>
        </Stack>
        <Divider my={10} />
        <Flex justify="space-between">
          <div>
            <Image src={ProfileImg} width={220} height={220} radius="md" />
          </div>
          <Stack w={250}>
            <FileButton
              onChange={setFile}
              accept="image/png,image/jpeg"
              variant="light"
              color="cyan"
              radius="xs"
              style={{ marginTop: '10px' }}
            >
              {(props) => <Button {...props}>Upload your avatar</Button>}
            </FileButton>

            <Text size="sm">
              Upload a file from your device. Image should be square, at least
              184px x 184px.
            </Text>
          </Stack>
        </Flex>
        <Spacer y={0.5} />
        <Text size="1.1rem" weight={400}>
          YOUR AVATARS
        </Text>
        <Group mih={50} bg="var(--sidebar-color)" p={20}>
          {[
            '/images/avatar1.jpg',
            '/images/avatar2.jpg',
            '/images/avatar3.jpg',
            '/images/avatar4.jpg',
            '/images/avatar5.jpg',
          ].map((item) => (
            <div onClick={HandleSelectedImg(item)}>
              <Image
                className={Styles.Avatar_img}
                src={item}
                width="10em"
                height="10em"
                radius="md"
              />
            </div>
          ))}
        </Group>
      </Stack>
      <Group position="right">
        <Button
          variant="filled"
          color="gray"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
          onClick={() => {
            setProfileImg(UserData.imgProfile);
          }}
        >
          CANCEL
        </Button>
        <Button
          variant="light"
          color="cyan"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
          onClick={HandleUpdateProfile()}
        >
          SAVE
        </Button>
      </Group>
    </Flex>
  );
}

function Security() {
  const [is2fa, set2fa] = useState<boolean>(false);
  const [qr, setQr] = useState<string>('');
  const [Loading, setLoading] = useState<boolean>(true);
  const [verified2FA, setVerified2FA] = useState<boolean>(false);
  const [Code, setCode] = useState<string>('');
  const [Error2FA, setError2FA] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    GetMe()
      .then((res) => {
        set2fa(res.body.twoFactorAuth);
        setVerified2FA(res.body.verified2FA);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  return (
    <Flex direction="column" w="100%">
      <Stack justify="flex-start" spacing="sm" mih="52em">
        <Text size="1.7rem" weight={400}>
          SECURITY
        </Text>
        <Text size="1rem" weight={400}>
          Enable Google Authenticator to protect your account from unauthorized
          access.
        </Text>
        <Spacer y={0.3} />
        <Text size="1.3rem" weight={400}>
          ACCOUNT SECURITY
        </Text>

        <Divider />
        <Spacer y={0.1} />

        <Checkbox
          label="Enable Google 2FA"
          checked={is2fa}
          onChange={(e) => Handle2fa(e)}
        />
        <Stack>
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
        </Stack>
      </Stack>
      <Group position="right">
        <Button
          variant="filled"
          color="gray"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
        >
          CANCEL
        </Button>
        <Button
          variant="light"
          color="cyan"
          w={200}
          radius="xs"
          style={{ marginTop: '10px' }}
        >
          SAVE
        </Button>
      </Group>
    </Flex>
  );
}

function Info() {
  const [active, setActive] = useState(0);

  return (
    <div className="dash_container">
      <Container size="xl">
        <Stack>
          <Flex
            mih={240}
            justify="space-between"
            align="start"
            direction="row"
            wrap="wrap"
          >
            <Flex
              mih="10em"
              bg="var(--primary-color)"
              direction="column"
              style={{
                borderRadius: '5px',
                width: '25%',
                padding: '20px 15px',
              }}
            >
              <SideLink active={active} setActive={setActive} />
            </Flex>
            <Flex
              mih="60em"
              bg="rgba(0, 0, 0, .3)"
              justify="start"
              align="start"
              direction="row"
              wrap="wrap"
              style={{
                borderRadius: '5px',
                width: '74%',
                padding: '15px 20px',
              }}
            >
              {active === 0 && <General />}
              {active === 1 && <UserAvatar />}
              {active === 2 && <Security />}
            </Flex>
          </Flex>
        </Stack>
        <Spacer y={4} />
      </Container>
    </div>
  );
}

export default Info;
