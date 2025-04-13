import React, { useEffect, useState } from 'react';
import {
  fetchAvailableRooms,
  createRoomIfNeeded,
  joinRoom
} from '../../apiService';
import Button from '../Button';
import useUser from '../../hooks/useUser';

const MultiplayerModal = ({ isOpen, gameId, onClose, onStartGame }) => {
  const { userId, loading } = useUser();
  const [gameRooms, setGameRooms] = useState([]);

  useEffect(() => {
    if (isOpen && userId && !loading) {
      const setupRooms = async () => {
        const availableRooms = await fetchAvailableRooms(gameId);

        if (availableRooms.length > 0) {
          // Show the list for user to choose from
          setGameRooms(availableRooms);
        } else {
          // No available rooms → create and auto-join
          const newRoom = await createRoomIfNeeded(gameId, userId);
          if (newRoom) {
            onStartGame(newRoom); // immediately start game with new room
            onClose();
          }
        }
      };

      setupRooms();
    }
  }, [isOpen, gameId, userId, loading]);

  const handleJoinRoom = async (room) => {
    const joinedRoom = await joinRoom(room.room, userId);
    if (joinedRoom) {
      onStartGame(joinedRoom);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='mq-modal-overlay mq-ending-title'>
      <div className='mq-modal-content'>
        <h2>Available Rooms</h2>
        {gameRooms.length > 0 ? (
          <ul>
            {gameRooms.map((room) => (
              <li key={room.room}>
                <span>{room.room}</span>
                <Button
                  text='Join'
                  onClick={() => handleJoinRoom(room)}
                >
                  Join
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Creating a new room...</p>
        )}
        <Button
          onClick={onClose}
          text='Close'
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default MultiplayerModal;
