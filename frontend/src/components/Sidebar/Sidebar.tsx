import React, { useEffect, useState } from 'react';
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
} from '@nextui-org/react';
import { FiSearch } from 'react-icons/fi';
import { Button } from '@mantine/core';
import { BiBook } from 'react-icons/bi';
import Styles from './Sidebar.module.css';
import { MdDashboard } from 'react-icons/md';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FiUsers } from 'react-icons/fi';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { FaUserAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { GetUserData } from '@/pages/api/user';

export function User_Sidebar({ Show }: { Show: boolean }) {
  if (Show) return;

  const router = useRouter();

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Username, setUsername] = useState('');
  const [Clickedon, setClickedon] = useState(1);
  const [PhotoUrl, setPhotoUrl] = useState('');
  const [UserData, setUserData] = useState<any>(null);

  useEffect(() => {
    const urlPath = window.location.pathname;

    if (urlPath === '/home/dashboard') {
      setClickedon(1);
    } else if (urlPath === '/home/chat') {
      setClickedon(2);
    } else if (urlPath === '/home/friends') {
      setClickedon(3);
    } else if (urlPath === '/home/leaderboard') {
      setClickedon(4);
    } else if (urlPath === '/home/account') {
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

    searchBtn.addEventListener('click', handleSearchClick);
    modeSwitch.addEventListener('click', handleModeClick);

    // Cleanup the event listeners when the component unmounts
    return () => {
      searchBtn.removeEventListener('click', handleSearchClick);
      modeSwitch.removeEventListener('click', handleModeClick);
    };
  }, []);

  const HandleLogout = () => {
    localStorage.removeItem('jwtToken');
    // router.push('/');
    window.location.href = '/';
  };

  const handleActions = (actionKey: string) => {
    if (actionKey === 'logout') {
      HandleLogout();
    }
  };

  const HandleSelected = (index: number) => {
    setClickedon(index);
  };

  return (
    <React.Fragment>
      <nav className="sidebar close">
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
            <li className="search-box">
              <i className="bx bx-search icon"></i>
              <input
                type="text"
                placeholder="Search..."
                style={{ backgroundColor: '#252E3E' }}
              />
            </li>
            <Spacer y={0.5} />
            <ul className="menu-links">
              <li
                className={`nav-link ${Clickedon === 1 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(1);
                }}
              >
                <Link href="/home/dashboard">
                  <i
                    className=" icon"
                    style={{ color: Clickedon === 1 ? '#F31260' : '' }}
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
                <Link href="/home/chat">
                  <i
                    className=" icon"
                    style={{ color: Clickedon === 2 ? '#F31260' : '' }}
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
                    style={{ color: Clickedon === 3 ? '#F31260' : '' }}
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
                className={`nav-link ${Clickedon === 4 ? 'activeSelect' : ''}`}
                onClick={() => {
                  HandleSelected(4);
                }}
              >
                <Link href="/home/leaderboard">
                  <i
                    className=" icon"
                    style={{ color: Clickedon === 4 ? '#F31260' : '' }}
                  >
                    <BiBarChartAlt2 />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 4 ? '#fff' : '' }}
                  >
                    Leaderboard
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
                <Link href="/home/account">
                  <i
                    className=" icon"
                    style={{ color: Clickedon === 5 ? '#F31260' : '' }}
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
        <Navbar variant="sticky" maxWidth={'fluid'}>
          <Grid>
            <Input
              clearable
              contentLeft={<FiSearch size={16} />}
              contentLeftStyling={false}
              css={{
                w: '100%',
                '@xsMax': {
                  mw: '300px',
                },
                '& .nextui-input-content--left': {
                  h: '100%',
                  ml: '$4',
                  dflex: 'center',
                },
              }}
              placeholder="Search..."
            />
          </Grid>
          <Grid
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          ></Grid>

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
              onAction={(actionKey) => handleActions(actionKey)}
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
        </Navbar>
      </Grid>
    </React.Fragment>
  );
}
