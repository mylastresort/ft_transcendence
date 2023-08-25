import request from 'superagent';

export const Get_Not_Friends = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/friends/Users-Not-Friends')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostSendFriendRequest = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/SendFriendRequest')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostCancelFriendRequest = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/CancelFriendRequest')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostRemoveFriendFromList = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/RemoveFriendFromList')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetFriendRequests = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/friends/GetFriendRequests')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostAcceptFriendRequest = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/AcceptFriendRequest')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetFriendsList = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/GetFriends')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostUnfriend = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/unfriend')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostBlockFriend = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/BlockUser')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetBLockedFriends = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/friends/GetBlockedUsers')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const PostUnblock = (body: any) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/friends/UnblockUser')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetPlayerStats = (data) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/game/player')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetGameMatches = (data) => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .post(process.env.BACKEND_DOMAIN + '/api/v1/game/games')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send(data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export const GetAchievements = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  return request
    .get(process.env.BACKEND_DOMAIN + '/api/v1/game/achievements')
    .set('Authorization', `Bearer ${jwtToken}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};
