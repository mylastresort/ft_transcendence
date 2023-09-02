import { Button } from '@mantine/core';
import { useRouter } from 'next/router';

export function LoginButton({ s }) {
  const router = useRouter();
  const handleLogin = (e) => {
    router.push(process.env.BACKEND_DOMAIN + '/api/v1/auth/42');
  };
  return (
    <Button
      size={s}
      radius={20}
      sx={{
        width: '250px',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0px 0px 10px #F31260',
        '&:hover': {
          backgroundColor: '#F31260',
        },
      }}
      onClick={handleLogin}
    >
      login with
      <img
        style={{
          marginLeft: '10px',
          width: '30px',
        }}
        src="/images/icon_42.svg"
      />
    </Button>
  );
}
