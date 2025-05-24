// components/UserOnlineStatus.js
'use client';
import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';

const UserOnlineStatus = ({ userId }) => {
  const isOnline = useOnlineStatus(userId);

  if (isOnline === null) return null;

  return (
    <span
      className={`mq-player-status ${
        isOnline ? 'mq-player-online' : 'mq-player-offline'
      }`}
    />
  );
};

export default UserOnlineStatus;
