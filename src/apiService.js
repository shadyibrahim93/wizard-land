import { createClient } from '@supabase/supabase-js';

const baseURL = process.env.REACT_APP_SUPABASE_URL;
const apiKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(baseURL, apiKey);

export async function getDropZoneShapes(level) {
  const { data, error } = await supabase
    .from('dropzone-shapes')
    .select('*')
    .eq('level', level);
  if (error) {
    console.error('Error fetching dropzone shapes:', error);
  }

  return data;
}

export async function getMemoryShapes(level) {
  const { data, error } = await supabase
    .from('memory_shapes')
    .select('*')
    .eq('level', level);
  if (error) {
    console.error('Error fetching memory shapes:', error);
  }

  return data;
}

export async function getMemorySequence(level) {
  const { data, error } = await supabase
    .from('sequence')
    .select('*')
    .eq('level', level);
  console.log(data);

  if (error) {
    console.error('Error fetching sequence data:', error);
  }

  return data;
}

export async function getScrambleWords(level) {
  const { data, error } = await supabase
    .from('scramble_words')
    .select('*')
    .eq('level', level);
  console.log(data);

  if (error) {
    console.error('Error fetching scramble data:', error);
  }

  return data;
}

export async function getSudokuBoard(level) {
  const { data, error } = await supabase
    .from('sudoku_game')
    .select('*')
    .eq('level', level);

  if (error) {
    console.error('Error fetching sudoku data:', error);
  }

  return data;
}

export async function getPuzzleImageData(level) {
  const { data, error } = await supabase
    .from('puzzle_images')
    .select('*')
    .eq('level', level);

  if (error) {
    console.error('Error fetching puzzle data:', error);
  }

  return data;
}

export async function signUp({ email, password, fullName }) {
  console.log('Full Name:', fullName);
  const { data: authUser, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('Signup error:', error.message);
    return;
  }

  const userId = authUser.user.id;

  // Insert into your custom `users` table
  const { error: insertError } = await supabase.from('users').insert({
    id: userId,
    email,
    full_name: fullName
  });

  if (insertError) {
    console.error('User insert error:', insertError.message);
  } else {
    console.log('User signed up and added to DB!');
  }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Sign-in error:', error.message);
    return null;
  }

  // Fetch the full_name from the custom users table using the user ID
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', data.user.id)
    .single();

  if (userError) {
    console.error('Error fetching user data:', userError.message);
    return null;
  }

  // Attach the full_name to the user object
  data.user.full_name = userData.full_name;

  console.log('Signed in user:', data.user);
  window.location.reload();
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('User signed out successfully');
    window.location.reload();
  }
}

export const createGameChatRoom = async (gameName) => {
  const { data, error } = await supabase
    .from('game_chat_rooms')
    .insert([{ game_name: gameName }])
    .single();

  if (error) {
    console.error('Error creating chat room:', error);
  }

  return data;
};

// Send a message in a game chat room
export async function sendMessage(
  gameChatRoomId,
  senderId,
  senderName,
  messageContent
) {
  const { error } = await supabase.from('messages').insert([
    {
      game_chat_room_id: gameChatRoomId,
      sender_id: senderId,
      sender_name: senderName,
      message: messageContent
    }
  ]);

  if (error) {
    console.error('Error sending message:', error);
  }
}

// Fetch messages from the last 7 days for a specific game chat room
export async function fetchMessages(gameChatRoomId) {
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, sender_name, message, created_at')
    .eq('game_chat_room_id', gameChatRoomId)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data;
}

// Real-time subscription to messages in a game chat room
export function subscribeToGameChatRoom(gameChatRoomId, onNewMessage) {
  const channel = supabase
    .channel(`game-chat-${gameChatRoomId}`) // Subscribe to the specific chat room
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `game_chat_room_id=eq.${gameChatRoomId}` // Filter by the specific game chat room ID
      },
      (payload) => {
        // Call the callback with the new message
        onNewMessage(payload.new);
      }
    )
    .subscribe();

  // Return the channel to unsubscribe when needed
  return channel;
}

// Fetch latest exp and stars for a user in a game
export async function fetchUserGameProgress(userId, gameId) {
  const { data, error } = await supabase
    .from('user_game_progress')
    .select('exp, stars')
    .eq('user_id', userId)
    .eq('game_id', gameId);

  if (error) {
    console.error('Error fetching progress:', error);
    return null;
  }

  return data;
}

// Add exp and gold to a user's game progress
export async function updateUserGameProgress(
  userId,
  gameId,
  starsToAdd,
  expToAdd
) {
  const { error } = await supabase.rpc('update_user_game_progress', {
    input_user_id: userId,
    input_game_id: gameId,
    stars_to_add: starsToAdd,
    exp_to_add: expToAdd
  });

  if (error) {
    console.error('Error updating progress:', error);
    return false;
  }

  return true;
}

export async function fetchUserWallet(userId) {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('euro')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user wallet:', error);
    return { euro: 0 };
  }

  if (!data || data.length === 0) {
    return { euro: 0 };
  }

  return data[0]; // Return the first (and only) wallet row
}
// Subscribe to progress changes in real-time (optional)
export function subscribeToUserGameProgress(userId, gameId, onProgressUpdate) {
  const channel = supabase
    .channel(`progress-${userId}-${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_game_progress',
        filter: `user_id=eq.${userId},game_id=eq.${gameId}`
      },
      (payload) => {
        onProgressUpdate(payload.new); // Contains updated exp and gold
      }
    )
    .subscribe();

  return channel;
}

export const fetchAllUserGameProgress = async (userId) => {
  const { data, error } = await supabase
    .from('user_game_progress')
    .select('exp, stars')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching all game progress:', error);
    return [{ exp: 0, stars: 0 }];
  }

  if (!data || data.length === 0) {
    return [{ exp: 0, stars: 0 }];
  }

  return data;
};

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      if (authError?.message !== 'Auth session missing!') {
        console.error('Error getting current user:', authError.message);
      }
      return null;
    }

    // Fetch additional profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError.message);
    }

    // Merge full_name into user.user_metadata
    return {
      ...user,
      user_metadata: {
        ...user.user_metadata,
        full_name: profile?.full_name || user.user_metadata?.full_name
      }
    };
  } catch (err) {
    console.error('Unexpected error getting current user:', err);
    return null;
  }
}

// ✅ Fetch available rooms for a given game where player2 is not yet assigned
export async function fetchAvailableRooms(gameId) {
  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('game_id', gameId)
    .is('player2', null); // Room has no second player yet

  if (error) {
    console.error('Error fetching available rooms:', error);
    return [];
  }

  return data;
}

// ✅ Create a room if none are available, otherwise return an existing one
export async function createRoomIfNeeded(gameId, userId) {
  const availableRooms = await fetchAvailableRooms(gameId);

  if (availableRooms.length === 0) {
    // No open rooms, so create one
    const roomCode = Math.floor(10000 + Math.random() * 90000); // 5-digit room ID

    const { data, error } = await supabase
      .from('game_rooms')
      .insert([
        {
          player1: userId,
          game_id: gameId,
          room: roomCode,
          created_at: new Date().toISOString()
        }
      ])
      .select(); // Return newly created room(s)

    if (error) {
      console.error('Error creating new room:', error);
      return null;
    }

    return data[0]; // Return the first room object created
  } else {
    // Return the first available room
    return availableRooms[0];
  }
}

// ✅ Join an available room by setting player2
export async function joinRoom(roomId, userId) {
  const { data, error } = await supabase
    .from('game_rooms')
    .update({ player2: userId })
    .eq('room', roomId)
    .select()
    .single(); // Return the updated room

  if (error) {
    console.error('Error joining room:', error);
    return null;
  }

  return data;
}

// Update your apiService.js subscribeToBoardUpdates function:
export function subscribeToBoardUpdates(roomId, onBoardUpdate) {
  const channel = supabase
    .channel(`board-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all changes
        schema: 'public',
        table: 'game_state',
        filter: `room=eq.${roomId}`
      },
      (payload) => {
        console.log('Game state update:', payload);
        onBoardUpdate(payload.new);
      }
    )
    .subscribe();

  return channel;
}

// Update your updateBoardState function to handle initial state:
export async function updateBoardState(
  roomId,
  board,
  gameId,
  currentTurn,
  winner = null
) {
  const { data, error } = await supabase
    .from('game_state')
    .upsert([
      {
        room: roomId,
        board_state: board,
        game_id: gameId,
        current_turn: currentTurn,
        winner: winner
      }
    ])
    .eq('room', roomId)
    .eq('game_id', gameId)
    .select();

  if (error) {
    console.error('Error updating game state:', error);
    return null;
  }

  return data;
}

export function subscribeToOpponentJoin(roomId, onOpponentJoin) {
  const channel = supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_rooms',
        filter: `room=eq.${roomId}`
      },
      (payload) => {
        console.log('Room update payload:', payload);
        // Send the full room data to the callback
        onOpponentJoin(payload.new);
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromChannels(channels) {
  if (!channels || !Array.isArray(channels)) return;

  channels.forEach((channel) => {
    try {
      supabase.removeChannel(channel);
    } catch (error) {
      console.error('Error unsubscribing from channel:', error);
    }
  });
}
