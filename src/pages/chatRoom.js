import { useState, useEffect } from 'react';
import {
  sendMessage,
  fetchMessages,
  subscribeToGameChatRoom
} from '../apiService';
import Button from '../components/Button';
import { playUncover, playDisappear } from '../hooks/useSound';
import useUser from '../hooks/useUser';

const GameChat = ({ chatTitle, gameId }) => {
  const { userId, userName } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

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
      <header>
        <span>{chatTitle}</span>
      </header>
      <div className='mq-messages'>
        {messages.map((msg) => (
          <div
            className={`${msg.sender_name === userName ? 'mq-local-user' : ''}`}
          >
            <span className='mq-message--user'>
              {msg.sender_name === userName ? 'You' : msg.sender_name}
            </span>
            <div
              key={msg.id ?? Math.random()}
              className='mq-message'
            >
              <span className='mq-message--messsage'>{msg.message}</span>
              <span className='mq-message--date'>
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
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
