import { Grid, Image, Button } from '@nextui-org/react';
import '@fontsource/poppins';
import { useRouter } from 'next/router';
import { LoginButton } from '../LandingPage/LoginButton';

export const MainNavbar = ({ Show, isTwoFactorAuth }) => {
  if (!Show || isTwoFactorAuth) {
    return null;
  }

  const router = useRouter();
  const handleLogin = () => {
    router.push(process.env.BACKEND_DOMAIN + '/api/v1/auth/42');
  };

  return (
    <nav
      style={{
        display: 'flex',
        width: '100vw',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #2C3A4A',
        padding: '15px 20px',
        backgroundColor: 'var(--sidebar-color)',
        zIndex: 2,
      }}
    >
      <div>
        <img src="/logo.svg" alt="Logo" style={{ height: '50px' }} />
      </div>
      <div>
        <LoginButton s={'sm'}/>
      </div>
    </nav>
  );
};
