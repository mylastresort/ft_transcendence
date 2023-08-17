import { useState, useEffect } from 'react';
import React from 'react';
import {
  Modal,
  Stack,
  Text,
  Flex,
  Divider,
  Image,
  FileButton,
  Button,
  Space,
  Group,
  Input,
  Select,
  Textarea,
} from '@mantine/core';
import { GetMe } from '@/pages/api/auth/auth';
import { GetUserData, PostUpdateProfile } from '@/pages/api/user';
import { PostUpload, PostLocalImg } from '@/pages/api/file';
import Styles from './FirstTimeModal.module.css';

function FirstTimeModal() {
  const [file, setFile] = useState<File | null>(null);
  const [ProfileImg, setProfileImg] = useState<any>(null);
  const [UserData, setUserData] = useState<any>(null);
  const [Username, setUsername] = useState<string>('');
  const [FirstName, setFirstName] = useState<string>('');
  const [LastName, setLastName] = useState<string>('');
  const [Country, setCountry] = useState<string | null>(null);
  const [Summary, setSummary] = useState<string>('');
  const [SelectedImg, setSelectedImg] = useState<any>(null);

  useEffect(() => {
    GetMe()
      .then((res) => {
        setUserData(res.body);
        setProfileImg(res.body.imgProfile);
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
          setUserData(res.body);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      window.alert('Please fill all the fields');
    }
  };

  return (
    <Modal
      opened={UserData?.isFirstTime}
      onClose={() => {}}
      centered
      size="50vw"
      withCloseButton={false}
    >
      <Stack align="center">
        <Text fz="lg" fw={600}>
          Update your profile to get started
        </Text>
        <>
          <Flex direction="column" w="100%">
            <div>
              <Divider my={10} />
              <Flex justify="center" direction="column" align="center">
                <div>
                  <Image
                    src={ProfileImg}
                    width={190}
                    height={190}
                    radius="xl"
                    mb="lg"
                  />
                </div>
                <Stack w={250}>
                  <FileButton onChange={setFile} accept="image/png,image/jpeg">
                    {(props) => <Button {...props}>Upload your avatar</Button>}
                  </FileButton>

                  <Text align="center" size="xs">
                    Upload a file from your device. Image should be square, at
                    least 184px x 184px.
                  </Text>
                </Stack>
              </Flex>
              <Space />
              <>
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
                  ].map((item, index) => (
                    <div onClick={HandleSelectedImg(item)} key={index}>
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
              </>
            </div>
            <Divider my={40} />
            <Stack justify="flex-start" spacing="sm" mih="52em">
              <Space />

              <Text size="1.3rem" weight={400}>
                GENERAL
              </Text>
              <Divider />
              <Space />
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
              <Space />

              <Text size="1.3rem" weight={400}>
                LOCATION
              </Text>
              <Divider />
              <Space />

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
              <Space />

              <Text size="1.3rem" weight={400}>
                SUMMARY
              </Text>
              <Divider />
              <Space />
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
            <Group position="center">
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
        </>
      </Stack>
    </Modal>
  );
}

export default FirstTimeModal;
