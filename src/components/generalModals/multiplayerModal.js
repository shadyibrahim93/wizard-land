import React, { useEffect, useState } from 'react';
import {
  fetchAvailableRooms,
  createRoom,
  joinRoom,
  subscribeToNewRooms,
  supabase
} from '../../apiService';
import Button from '../Button';
import { useUser } from '../../context/UserContext';

const MultiplayerModal = ({ gameId, onStartGame, setGameMode }) => {
  const { userId, loading } = useUser();
  const [gameRooms, setGameRooms] = useState([]);
  const [noRooms, setNoRooms] = useState(false);

  useEffect(() => {
    if (userId && !loading) {
      showAvailableRooms();
    }
  }, [gameId, userId, loading]);

  // ✅ Subscribe to new rooms using API method
  useEffect(() => {
    const channel = subscribeToNewRooms(gameId, (newRoom) => {
      setGameRooms((prevRooms) => {
        const exists = prevRooms.some((room) => room.room === newRoom.room);
        return exists ? prevRooms : [...prevRooms, newRoom];
      });
      setNoRooms(false);
    });

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

  const handleCreateAndJoinRoom = async () => {
    const newRoom = await createRoom(gameId, userId);
    if (newRoom) {
      setGameMode('Multiplayer');
      onStartGame(newRoom, userId);
    }
  };

  const handleJoinRoom = async (room) => {
    const joinedRoom = await joinRoom(room.room, userId);
    if (joinedRoom) {
      setGameMode('Multiplayer');
      onStartGame(joinedRoom, userId);
    }
  };

  const handlePractice = () => {
    setGameMode('Single');
    onStartGame({}, userId);
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
              <span>{room.room}</span>
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
        <Button
          onClick={handlePractice}
          text='Practice'
        />
        <Button
          onClick={handleCreateAndJoinRoom}
          text='Create Room'
        />
      </div>
    </div>
  );
};

export default MultiplayerModal;
