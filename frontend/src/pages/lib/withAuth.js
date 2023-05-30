import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const withAuth = (WrappedComponent) => {
  const Auth = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
    }, []);

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return Auth;
};

export default withAuth;
