import React, { useEffect, useState } from 'react';
import { Container, Card, Input, Checkbox, Button, Tabs } from '@mantine/core';
import { Text, Grid, Spacer, Avatar, Image } from '@nextui-org/react';
import Styles from './account.module.css';
import { GetUserData, PostUpdateProfile } from '@/pages/api/user';
import { Post2fa, PostVerify2fa } from '@/pages/api/auth/auth';
import { PostUpload } from '@/pages/api/file';
import withAuth from '@/pages/lib/withAuth';
import { Account_Settings } from '@/components/Pageutils/Account_Settings';
import { Friends_List } from '@/components/Pageutils/Friends_List';
import { Blocked_List } from '@/components/Pageutils/Blocked_List';
import { User_Status } from '@/components/Pageutils/User_Status';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsCardList } from 'react-icons/bs';
import { ImBlocked } from 'react-icons/im';
import { FaUserFriends } from 'react-icons/fa';

const DummyData = {
  title: 'Stats',
  level: 2.3,
  total: 99,
  stats: [
    {
      value: 2.3,
      label: 'Lvl',
    },
    {
      value: 23,
      label: 'Wins',
    },
    {
      value: 5,
      label: 'Losses',
    },
  ],
};

function account() {
  const [UserData, setUserData] = useState<any>(null);

  useEffect(() => {
    GetUserData()
      .then((res) => {
        setUserData(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Grid className="dash_container">
      <Container size="xl">
        <Spacer y={4} />
        <Grid className={Styles.Account_layout}>
          <Grid>
            <User_Status
              title={DummyData.title}
              level={DummyData.level}
              total={DummyData.total}
              stats={DummyData.stats}
            />
          </Grid>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{
              width: '80%',
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <Tabs defaultValue="5" style={{ width: '100%' }}>
              <Tabs.List grow>
                <Tabs.Tab
                  value="1"
                  color="lime"
                  icon={<FaUserFriends size="0.8rem" />}
                >
                  Friends
                </Tabs.Tab>
                <Tabs.Tab
                  value="3"
                  color="red"
                  icon={<ImBlocked size="0.8rem" />}
                >
                  Blocked
                </Tabs.Tab>
                <Tabs.Tab
                  value="5"
                  color="blue"
                  icon={<IoSettingsOutline size="0.8rem" />}
                >
                  Accout Settings
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="1" pt="xl">
                <Friends_List />
              </Tabs.Panel>
              <Tabs.Panel value="3" pt="xl">
                <Blocked_List />
              </Tabs.Panel>
              <Tabs.Panel
                value="5"
                style={{
                  padding: '40px 0',
                }}
              >
                <Grid css={{ display: 'flex', justifyContent: 'center' }}>
                  <Account_Settings UserData={UserData} />
                </Grid>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid>
      </Container>
    </Grid>
  );
}

export default withAuth(account);
