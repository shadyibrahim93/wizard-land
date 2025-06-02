'use client';

import { useState, useEffect } from 'react';
import {
  sendMessage,
  fetchMessages,
  subscribeToGameChatRoom
} from '../apiService.js';
import Button from './Button.js';
import { playUncover, playDisappear } from '../hooks/useSound.js';
import { useUser } from '../context/UserContext.js';
import useSelectedRealm from '../hooks/userSelectedRealm.js';
import Avatar from 'boring-avatars';
import UserOnlineStatus from './UserOnlineStatus.jsx';
import { Filter } from 'bad-words';

const GameChat = ({ chatTitle, gameId }) => {
  const { userId, userName } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { realm, resolved } = useSelectedRealm();
  const [cooldown, setCooldown] = useState(0);
  const filter = new Filter();

  filter.addWords('ass hole', 'hell', 'mf', 'fu', 'ah');

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    const fetchMessagesForRoom = async () => {
      const fetchedMessages = await fetchMessages(gameId);
      setMessages(fetchedMessages);
    };

    fetchMessagesForRoom();

    // Subscribe to game chat room for real-time updates
    subscribeToGameChatRoom(gameId, (newMessage) => {
      playUncover();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [gameId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(gameId, userId, userName, newMessage);
      playDisappear();
      setNewMessage('');
      setCooldown(5);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.mq-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='mq-game-side-modal mq-side-modal-wrapper'>
      <div>
        <header>
          <h2 className='mq-section-title'>
            {realm !== 'fantasy' && resolved ? (
              <img
                className='mq-chat-icon'
                src={`/assets/images/${realm}/elements/chat.png`}
                alt={`${chatTitle} Game Chat | Wizard Land`}
                title={`${chatTitle} Game Chat | Wizard Land`}
              />
            ) : (
              ''
            )}
            {chatTitle}
          </h2>
        </header>
        <div className='mq-messages'>
          {messages.length === 0 && <h3>Start Chating!</h3>}

          {messages.map((msg) => (
            <>
              <div
                key={msg.id ?? `${msg.sender_name}-${Math.random()}`}
                className={`${
                  msg.sender_name === userName
                    ? 'mq-user-container mq-local-user'
                    : 'mq-user-container'
                }`}
              >
                <div
                  key={msg.id ?? Math.random()}
                  className='mq-message'
                >
                  <span className='mq-message--user'>
                    {msg.sender_name === userName ? 'You' : msg.sender_name}
                  </span>
                  <span className='mq-message--messsage'>
                    {filter.clean(msg.message)}
                  </span>
                </div>
                <div className='mq-player-profile'>
                  <Avatar
                    size={30}
                    name={msg.sender_name && msg.sender_name}
                    variant='beam'
                    colors={[
                      '#92A1C6',
                      '#146A7C',
                      '#F0AB3D',
                      '#C271B4',
                      '#C20D90'
                    ]}
                  />
                  {msg.sender_id && <UserOnlineStatus userId={msg.sender_id} />}
                </div>
              </div>
              <span className='mq-message--date'>
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder='Type a message'
          required
        />
        <Button
          text={`${cooldown > 0 ? `${cooldown}` : 'Send'}`}
          type='submit'
          className='mq-submit-btn'
          isDisabled={cooldown > 0}
        ></Button>
      </form>
    </div>
  );
};

export default GameChat;
