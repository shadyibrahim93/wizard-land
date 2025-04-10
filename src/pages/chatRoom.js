import { useState, useEffect } from 'react';
import {
  sendMessage,
  fetchMessages,
  subscribeToGameChatRoom
} from '../apiService';
import Button from '../components/Button';

const GameChat = ({ chatTitle, gameChatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userFullName'));
    if (user) {
      setUserId(user.userId);
      setUserName(user.fullName);
    }

    const fetchMessagesForRoom = async () => {
      const fetchedMessages = await fetchMessages(gameChatRoomId);
      setMessages(fetchedMessages);
    };

    fetchMessagesForRoom();

    // Subscribe to game chat room for real-time updates
    subscribeToGameChatRoom(gameChatRoomId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [gameChatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await sendMessage(gameChatRoomId, userId, userName, newMessage);

      // Directly update the state with the new message
      const newMessageObj = {
        sender_name: userName,
        message: newMessage,
        created_at: new Date().toISOString()
      };
      setNewMessage('');
    }
  };

  useEffect(() => {
    const container = document.querySelector('.mq-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized); // Toggle minimize state
  };

  return (
    <div className='mq-game-chat mq-chat-wrapper'>
      <header>{isMinimized ? '' : <span>{chatTitle}</span>}</header>
      {!isMinimized && (
        <div className='mq-messages'>
          {messages.map((msg) => (
            <div
              className={`${
                msg.sender_name === userName ? 'mq-local-user' : ''
              }`}
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
      )}

      <form
        onSubmit={handleSendMessage}
        style={{ display: isMinimized ? 'none' : 'flex' }}
      >
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
