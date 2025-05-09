'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchAvailableRooms,
  createRoom,
  joinRoom,
  subscribeToRoomChanges,
  supabase
} from '../../apiService';
import Button from '../Button';
import { useUser } from '../../context/UserContext';

const MultiplayerModal = ({ gameId, onStartGame, setGameMode }) => {
  const { userId, loading } = useUser();
  const [gameRooms, setGameRooms] = useState([]);
  const [noRooms, setNoRooms] = useState(false);
  const [createPassword, setCreatePassword] = useState('');
  const [joinPasswords, setJoinPasswords] = useState({});
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);

  useEffect(() => {
    if (userId && !loading) {
      showAvailableRooms();
    }
  }, [gameId, userId, loading]);

  // ✅ Subscribe to new rooms using API method
  useEffect(() => {
    const channel = subscribeToRoomChanges(
      gameId,
      (newRoom) => {
        // Handle INSERT
        setGameRooms((prevRooms) => {
          const exists = prevRooms.some((room) => room.room === newRoom.room);
          return exists ? prevRooms : [...prevRooms, newRoom];
        });
        setNoRooms(false);
      },
      (deletedRoom) => {
        // Handle DELETE
        setGameRooms((prevRooms) =>
          prevRooms.filter((room) => room.room !== deletedRoom.room)
        );
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const showAvailableRooms = async () => {
    const availableRooms = await fetchAvailableRooms(gameId);
    if (availableRooms.length > 0) {
      setGameRooms(availableRooms);
      setNoRooms(false);
    } else {
      setGameRooms([]);
      setNoRooms(true);
    }
  };

  const handleNumericInput = (value) => {
    // Allow empty string or numeric characters, preserve leading zeros
    return value === '' ? '' : value.replace(/\D/g, '');
  };

  const handleCreateClick = () => {
    setShowCreatePrompt(true);
  };

  const handleCreateConfirm = async () => {
    if (!userId) {
      alert('Please join our community to play!');
      return;
    }

    const newRoom = await createRoom(gameId, userId, createPassword);
    if (newRoom) {
      setGameMode('Multiplayer');
      onStartGame(newRoom, userId);
      setCreatePassword('');
      setShowCreatePrompt(false);
    }
  };

  const handleJoinRoom = async (room) => {
    const password = joinPasswords[room.room] || '';
    try {
      const joinedRoom = await joinRoom(room.room, userId, password);
      if (joinedRoom) {
        setGameMode('Multiplayer');
        onStartGame(joinedRoom, userId);
        setJoinPasswords((prev) => ({ ...prev, [room.room]: '' }));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePractice = () => {
    if (userId === null || userId === undefined) {
      alert('Please join our community to play!');
      return;
    }
    setGameMode('Single');
    onStartGame({}, userId);
  };

  const handleCreateCancel = () => {
    setShowCreatePrompt(false);
    setCreatePassword('');
  };

  return (
    <div className='mq-game-side-modal'>
      <header>
        <span>Multiplayer: Available Rooms</span>
      </header>

      {gameRooms.length > 0 ? (
        <ul className='mq-rooms-list'>
          {gameRooms.map((room) => (
            <li
              key={room.room}
              className='mq-room'
            >
              <div className='mq-room-info'>
                <span>{room.room}</span>
                {room.password !== null && room.password !== '' && (
                  <input
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    placeholder='Pin'
                    value={joinPasswords[room.room] || ''}
                    onChange={(e) =>
                      setJoinPasswords((prev) => ({
                        ...prev,
                        [room.room]: handleNumericInput(e.target.value)
                      }))
                    }
                    className='mq-code-input'
                  />
                )}
              </div>
              <Button
                text='Join'
                onClick={() => handleJoinRoom(room)}
              />
            </li>
          ))}
        </ul>
      ) : noRooms ? (
        <p>No rooms available!</p>
      ) : (
        <p>Loading rooms...</p>
      )}

      <div className='mq-btns-container'>
        {showCreatePrompt ? (
          <div className='mq-create-room-prompt'>
            <input
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              placeholder='Leave empty for a public room (numbers only)'
              value={createPassword}
              onChange={(e) =>
                setCreatePassword(handleNumericInput(e.target.value))
              }
              className='mq-code-input'
            />
            <div className='mq-prompt-buttons'>
              <Button
                onClick={handleCreateConfirm}
                text='Create Room'
              />
              <Button
                onClick={handleCreateCancel}
                text='Cancel'
                variant='secondary'
              />
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={handlePractice}
              text='Practice'
            />
            <Button
              onClick={handleCreateClick}
              text='Create Room'
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MultiplayerModal;
