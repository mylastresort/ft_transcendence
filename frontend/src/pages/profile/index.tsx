import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetMe } from '@/pages/api/auth/auth';

function index() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    if (!username) {
      GetMe()
        .then((res) => {
          if (res.body) {
            router.push(`/profile/${res.body.username}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [username]);

  return <div></div>;
}

export default index;
