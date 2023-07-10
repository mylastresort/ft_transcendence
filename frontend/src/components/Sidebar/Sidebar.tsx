import React, { useEffect, useState, useContext, use } from 'react';
// import './styles.css';
import 'boxicons/css/boxicons.min.css';
import Link from 'next/link';
import {
  Text,
  Grid,
  Input,
  Spacer,
  Image,
  Navbar,
  Dropdown,
  Avatar,
  Badge,
} from '@nextui-org/react';
import { FiSearch } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FiUsers } from 'react-icons/fi';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { GetUserData } from '@/pages/api/user';
import { Burger, Group, ActionIcon, Menu, Divider } from '@mantine/core';
import { IoNotifications } from 'react-icons/io5';
import { WsContext } from '@/context/WsContext';
import { MdLabelImportantOutline } from 'react-icons/md';

export const User_Sidebar = (Show: any) => {
  if (Show.Show) {
    return null;
  }

  const UserSocket = useContext(WsContext);

  const router = useRouter();

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Username, setUsername] = useState('');
  const [Clickedon, setClickedon] = useState(0);
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [UserData, setUserData] = useState<any>(null);
  const [Opened, setOpened] = useState(false);
  const [Auth, setAuth] = useState(false);
  const [Notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    UserSocket.on('GetNotifications', (data) => {
      setNotifications(data);
    });

    return () => {
      UserSocket.off('GetNotifications');
    };
  }, []);

  useEffect(() => {
    const urlPath = window.location.pathname;

    if (urlPath === '/game') {
      setClickedon(1);
    } else if (urlPath === '/chat') {
      setClickedon(2);
    } else if (urlPath === '/home/friends') {
      setClickedon(3);
    } else if (urlPath.includes('/profile') || urlPath === '/edit/info') {
      setClickedon(5);
    }

    GetUserData()
      .then((res) => {
        setUserData(res.body);
        setFirstName(res.body.firstName);
        setLastName(res.body.lastName);
        setUsername(res.body.username);
        setPhotoUrl(res.body.imgProfile);
      })
      .catch((err) => {
        console.log(err);
      });

    const body = document.querySelector('body') as HTMLBodyElement,
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector('.toggle'),
      searchBtn = body.querySelector('.search-box'),
      modeSwitch = body.querySelector('.toggle-switch'),
      modeText = body.querySelector('.mode-text');

    const handleToggleClick = () => {
      sidebar.classList.toggle('close');
    };

    const handleSearchClick = () => {
      sidebar.classList.remove('close');
    };

    const handleModeClick = () => {
      body.classList.toggle('dark');

      if (body.classList.contains('dark')) {
        modeText.innerText = 'Light mode';
      } else {
        modeText.innerText = 'Dark mode';
      }
    };

    return () => {
      modeSwitch.removeEventListener('click', handleModeClick);
    };
  }, []);

  const HandleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/');
  };

  const handleActions = (actionKey: string) => {
    if (actionKey === 'logout') {
      HandleLogout();
    }
  };

  const HandleSelected = (index: number) => {
    setClickedon(index);
  };

  const HandleReadNotification = () => {
    setTimeout(() => {
      UserSocket.emit('ReadNotifications', 'Read');
    }, 2000);
  };

  return (
    <React.Fragment>
      <nav className={`sidebar ${Opened ? '' : 'close'}`}>
        <header>
          <div className="image-text">
            <span className="image">
              <Image src="/images/LOGO.png" />
            </span>

            <div className="text logo-text">
              <span className="name">LOGO</span>
              <span className="profession">Game</span>
            </div>
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <li
              className="search-box"
              style={{ backgroundColor: 'var(--body-color)' }}
            >
              <i className="bx  icon">
                <Burger
                  color="#9DA4AE"
                  size="sm"
                  opened={Opened}
                  onClick={() => {
                    setOpened(!Opened);
                  }}
                />
              </i>
              <span
                className="text nav-text"
                style={{ color: Clickedon === 1 ? '#fff' : '' }}
              >
                LOGO MENU
              </span>
            </li>
            <Spacer y={0.5} />
            <ul className="menu-links">
              <li
                className={`nav-link ${Clickedon === 1 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(1);
                }}
              >
                <Link href="/game">
                  <i
                    className=" icon"
                    style={{
                      color: Clickedon === 1 ? 'var(--secondary-color)' : '',
                    }}
                  >
                    <MdDashboard />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 1 ? '#fff' : '' }}
                  >
                    Dashboard
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="menu-links">
              <li
                className={`nav-link ${Clickedon === 2 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(2);
                }}
              >
                <Link href="/Chat">
                  <i
                    className=" icon"
                    style={{
                      color: Clickedon === 2 ? 'var(--secondary-color)' : '',
                    }}
                  >
                    <HiOutlineChatAlt2 />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 2 ? '#fff' : '' }}
                  >
                    Chat
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="menu-links">
              <li
                className={`nav-link ${Clickedon === 3 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(3);
                }}
              >
                <Link href="/home/friends">
                  <i
                    className=" icon"
                    style={{
                      color: Clickedon === 3 ? 'var(--secondary-color)' : '',
                    }}
                  >
                    <FiUsers />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 3 ? '#fff' : '' }}
                  >
                    Friends
                  </span>
                </Link>
              </li>
            </ul>

            <ul className="menu-links">
              <li
                className={`nav-link ${Clickedon === 5 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(5);
                }}
              >
                <Link href="/profile">
                  <i
                    className=" icon"
                    style={{
                      color: Clickedon === 5 ? 'var(--secondary-color)' : '',
                    }}
                  >
                    <FaUserAlt />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 5 ? '#fff' : '' }}
                  >
                    Account
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <li className="">
              <a onClick={HandleLogout}>
                <i className="bx bx-log-out icon"></i>
                <span className="text nav-text">Logout</span>
              </a>
            </li>

            <li className="mode">
              <div className="sun-moon">
                <i className="bx bx-moon icon moon"></i>
                <i className="bx bx-sun icon sun"></i>
              </div>
              <span className="mode-text text">Dark mode</span>

              <div className="toggle-switch">
                <span className="switch"></span>
              </div>
            </li>
          </div>
        </div>
      </nav>
      <Grid className="home">
        <Navbar variant="sticky" maxWidth={'fluid'} disableShadow>
          <Grid>
            <Text
              size="lg"
              css={{
                fontFamily: 'poppins',
                color: 'var(--text-color)',
                fontWeight: '500',
              }}
            >
              Welcome zakaia kasmi
            </Text>
          </Grid>
          <Grid
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          ></Grid>
          <Group spacing="xl">
            <Menu
              width={300}
              shadow="md"
              position="bottom-end"
              closeOnItemClick={0}
            >
              <Menu.Target>
                <Grid
                  onClick={() => {
                    HandleReadNotification();
                  }}
                >
                  <Badge
                    color={
                      Notifications.filter((item: any) => !item.read).length > 0
                        ? 'error'
                        : 'default'
                    }
                    content={
                      Notifications.filter((item: any) => !item.read).length
                    }
                    // isInvisible={isInvisible}
                    shape="circle"
                    size="xs"
                  >
                    <IoNotifications
                      fill="currentColor"
                      size={28}
                      color="#fff"
                    />
                  </Badge>
                </Grid>
              </Menu.Target>

              <Menu.Dropdown>
                {Notifications.map((item: any, index: number) => (
                  <div>
                    <Menu.Item
                      icon={
                        item.read ? (
                          ''
                        ) : (
                          <MdLabelImportantOutline
                            size={17}
                            color="var(--secondary-color)"
                          />
                        )
                      }
                    >
                      {item.message}
                    </Menu.Item>
                    <Divider
                      style={{
                        display:
                          index === Notifications.length - 1 ? 'none' : '',
                      }}
                    />
                  </div>
                ))}
              </Menu.Dropdown>
            </Menu>
            <Dropdown placement="bottom-right">
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="primary"
                  size="md"
                  src={PhotoUrl}
                />
              </Dropdown.Trigger>
              <Dropdown.Menu
                aria-label="User menu actions"
                color="secondary"
                onAction={(actionKey: any) => handleActions(actionKey)}
              >
                <Dropdown.Item key="profile" css={{ height: '$18' }}>
                  <Text b color="inherit" css={{ d: 'flex' }}>
                    Signed in as
                  </Text>
                  <Text b color="inherit" css={{ d: 'flex' }}>
                    {Username}
                  </Text>
                </Dropdown.Item>
                <Dropdown.Item key="settings" withDivider>
                  <Link href="/home/settings">My Settings</Link>
                </Dropdown.Item>
                <Dropdown.Item key="help_and_feedback" withDivider>
                  <Link href="/home/contact">Help & Feedback</Link>
                </Dropdown.Item>
                <Dropdown.Item key="logout" withDivider color="error">
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Group>
        </Navbar>
      </Grid>
    </React.Fragment>
  );
};
