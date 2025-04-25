import { useState, useEffect } from 'react';
import {
  sendMessage,
  fetchMessages,
  subscribeToGameChatRoom
} from '../apiService';
import Button from './Button';
import { playUncover, playDisappear } from '../hooks/useSound';
import { useUser } from '../context/UserContext';

const GameChat = ({ chatTitle, gameId }) => {
  const { userId, userName } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const small = window.innerWidth < 768;
      setIsSmallScreen(small);
      if (!small) setIsMinimized(false); // Always expand on large screens
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchMessagesForRoom = async () => {
      const fetchedMessages = await fetchMessages(gameId);
      setMessages(fetchedMessages);
    };

    fetchMessagesForRoom();

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
    }
  };

  useEffect(() => {
    const container = document.querySelector('.mq-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`mq-game-side-modal mq-side-modal-wrapper mq-chat-room ${
        isMinimized ? 'mq-modal-minimized' : ''
      }`}
    >
      <div>
        <header className='mq-chat-header'>
          <span>{chatTitle}</span>
          {isSmallScreen && (
            <button
              className='mq-minimize-btn'
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? '+' : '-'}
            </button>
          )}
        </header>

        {(!isMinimized || !isSmallScreen) && (
          <div className='mq-messages'>
            {messages.length === 0 && <h3>Start Chating!</h3>}
            {messages.map((msg) => (
              <div
                key={msg.id ?? Math.random()}
                className={`${
                  msg.sender_name === userName ? 'mq-local-user' : ''
                }`}
              >
                <span className='mq-message--user'>
                  {msg.sender_name === userName ? 'You' : msg.sender_name}
                </span>
                <div className='mq-message'>
                  <span className='mq-message--messsage'>{msg.message}</span>
                  <span className='mq-message--date'>
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
          text='Send'
          type='submit'
          className='mq-submit-btn'
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default GameChat;
