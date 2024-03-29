import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    router.push(`/profile/${username}`);
  }, [username]);

  return <div>Index</div>;
}

export default Index;
