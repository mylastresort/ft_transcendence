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
import Cookies from 'js-cookie';

export function User_Sidebar({ Show }) {
  if (Show) return;

  const [phone, setPhone] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Clickedon, setClickedon] = useState(1);
  const [PhotoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const body = document.querySelector('body'),
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
    Cookies.remove('access_token');
    window.location.reload();
  };

  const handleActions = (actionKey) => {
    if (actionKey === 'logout') {
      HandleLogout();
    }
  };

  const HandleSelected = (index) => {
    setClickedon(index);
  };

  return (
    <React.Fragment>
      <nav className="sidebar ">
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
                <Link href="/">
                  <i
                    className=" icon"
                    style={{ color: Clickedon === 1 ? '#6366F1' : '' }}
                  >
                    <BiBook />
                  </i>
                  <span
                    className="text nav-text"
                    style={{ color: Clickedon === 1 ? '#fff' : '' }}
                  >
                    Pronominal Verbs
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
                src="/images/LOGO.png"
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
                  {Email}
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
