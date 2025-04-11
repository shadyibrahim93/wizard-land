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
    .eq('game_id', gameId)
    .single();

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

// Fetch user's wallet information (e.g., euro) from user_wallet table
export async function fetchUserWallet(userId) {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('euro') // Select the euro field
    .eq('user_id', userId)
    .single(); // Assumes each user has one wallet entry

  if (error) {
    console.error('Error fetching user wallet:', error);
    return null;
  }

  return data || { euro: 0 }; // Return 0 if no data exists for the user
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
    return [];
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
