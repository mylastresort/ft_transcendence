import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const Auth = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        if (router.pathname === '/' || router.pathname === '/login') {
          setIsAuthenticated(true);
        }
        router.push('/');
      } else {
        if (router.pathname === '/' || router.pathname === '/login') {
          router.push('/home/dashboard');
        }
        setIsAuthenticated(true);
      }
    }, []);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Auth;
};

export default withAuth;
