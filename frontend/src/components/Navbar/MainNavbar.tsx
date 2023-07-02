import { Grid, Image, Button } from '@nextui-org/react';
import '@fontsource/poppins';
import { useRouter } from 'next/router';

export const MainNavbar = ({ Show, isTwoFactorAuth }) => {
  if (!Show || isTwoFactorAuth) {
    return null;
  }

  const router = useRouter();
  const handleLogin = () => {
    router.push('http://localhost:4400/api/v1/auth/42');
  };

  return (
    <nav
      style={{
        backgroundColor: 'var(--sidebar-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px',
        borderBottom: '1px solid #2C3A4A',
      }}
    >
      <div>
        <img src="/images/LOGO.png" alt="Logo" style={{ width: '100px' }} />
      </div>
      <div>
        <Button
          auto
          color="error"
          css={{
            fontFamily: 'poppins',
            fontSize: '1.1rem',
            fontWeight: '600',
            padding: '0 1.8em 0 1.8em',
          }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </nav>
  );
};
