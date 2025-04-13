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
    .select('full_name, exp, stars')
    .eq('id', data.user.id)
    .single();

  if (userError) {
    console.error('Error fetching user data:', userError.message);
    return null;
  }

  return {
    ...data.user,
    full_name: userData.full_name,
    user_metadata: {
      ...data.user.user_metadata,
      exp: userData.exp,
      stars: userData.stars
    }
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('User signed out successfully');
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

// Fetch user's game progress without gameId
export async function fetchUserGameProgress(userId) {
  const { data, error } = await supabase
    .from('user_wallet')
    .select('exp, stars')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching progress:', error);
    return null;
  }

  return data;
}

// Add exp and stars to a user's progress
export async function updateUserGameProgress(userId, starsToAdd, expToAdd) {
  const { error } = await supabase.rpc('update_user_game_progress', {
    input_user_id: userId,
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
export function subscribeToUserGameProgress(userId, onProgressUpdate) {
  const channel = supabase
    .channel(`progress-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        onProgressUpdate(payload.new); // Contains updated exp and gold
      }
    )
    .subscribe();

  return channel;
}

export async function getCurrentUser() {
  try {
    // Get current session first (faster than getUser)
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    // Return basic user data immediately
    const basicUser = {
      ...session.user,
      user_metadata: {
        ...session.user.user_metadata,
        // Use email as fallback name for immediate response
        full_name: session.user.user_metadata?.full_name || session.user.email
      }
    };

    // Fetch profile data in background if needed
    if (!session.user.user_metadata?.full_name) {
      supabase
        .from('users')
        .select('full_name')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.full_name) {
            // Update the user metadata in state if component is still mounted
            supabase.auth.updateUser({
              data: { full_name: profile.full_name }
            });
          }
        });
    }

    return basicUser;
  } catch (err) {
    console.error('Error getting current user:', err);
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

export async function getShopItemsGroupedByType() {
  const { data, error } = await supabase.from('shop_items').select('*');

  if (error) {
    console.error('Error fetching shop items:', error);
    return {};
  }

  const grouped = {};

  data.forEach((item) => {
    const type = item.type;

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(item);
  });

  // Sort each category by gold price (ascending)
  Object.keys(grouped).forEach((type) => {
    grouped[type].sort((a, b) => (a.stars || 0) - (b.stars || 0));
  });

  return grouped;
}

export async function getUserInventoryGroupedByType(userId) {
  const { data, error } = await supabase
    .from('user_inventory')
    .select(
      `
      *,
      shop_items:item_id (
        id,
        name,
        type,
        piece,
        image,
        stars,
        euro
      )
    `
    )
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user inventory:', error);
    return {};
  }

  const grouped = {};

  data.forEach((entry) => {
    const item = entry.shop_items;
    if (!item) return; // skip if item details are missing

    const type = item.type;

    if (!grouped[type]) {
      grouped[type] = [];
    }

    grouped[type].push(item);
  });

  // Optionally, sort each group by price (lowest first)
  Object.keys(grouped).forEach((type) => {
    grouped[type].sort((a, b) => (a.gold || 0) - (b.gold || 0));
  });

  return grouped;
}

export async function purchaseItem(userId, itemId) {
  try {
    // 1. First get the item price to verify
    const { data: itemData, error: itemError } = await supabase
      .from('shop_items')
      .select('stars, euro')
      .eq('id', itemId)
      .single();

    if (itemError || !itemData) {
      console.error('Error fetching item details:', itemError);
      return { success: false, error: 'Item not found' };
    }

    // Use the item's actual price rather than the passed amount for security
    const itemPrice = itemData.stars || itemData.euro || 0;
    const currencyType = itemData.stars ? 'stars' : 'euro';

    // 2. Get current user balance
    let currentBalance;
    if (currencyType === 'stars') {
      const { data: progressData, error: progressError } = await supabase
        .from('user_wallet')
        .select('stars')
        .eq('user_id', userId)
        .single();

      if (progressError || !progressData) {
        console.error('Error fetching user stars:', progressError);
        return { success: false, error: 'Could not fetch user data' };
      }
      currentBalance = progressData.stars;
    } else {
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallet')
        .select('euro')
        .eq('user_id', userId)
        .single();

      if (walletError || !walletData) {
        console.error('Error fetching user wallet:', walletError);
        return { success: false, error: 'Could not fetch wallet data' };
      }
      currentBalance = walletData.euro;
    }

    // 3. Check if user has enough balance
    if (currentBalance < itemPrice) {
      return {
        success: false,
        error: `Not enough ${currencyType} to purchase this item`
      };
    }

    // 4. Deduct balance using RPC
    let updateError;
    await supabase.rpc('update_user_wallet', {
      input_user_id: userId,
      stars_to_add: currencyType === 'stars' ? -itemPrice : 0,
      euro_to_add: currencyType === 'euro' ? -itemPrice : 0,
      exp_to_add: 0
    });

    if (updateError) {
      console.error(`Error updating ${currencyType} via RPC:`, updateError);
      return { success: false, error: `Failed to deduct ${currencyType}` };
    }

    // 5. Add item to inventory
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('user_inventory')
      .insert([{ user_id: userId, item_id: itemId }])
      .select();

    if (inventoryError) {
      console.error('Error adding item to inventory:', inventoryError);
      // Refund the user if adding to inventory fails
      if (currencyType === 'stars') {
        await supabase.rpc('update_user_game_progress', {
          input_user_id: userId,
          stars_to_add: -itemPrice,
          exp_to_add: 0
        });
      } else {
        await supabase.rpc('user_wallet', {
          user_id: userId,
          euro: itemPrice
        });
      }
      return { success: false, error: 'Failed to add item to inventory' };
    }

    // 6. Return success with updated balance
    const newBalance = currentBalance - itemPrice;
    return {
      success: true,
      data: inventoryData,
      updatedBalance: newBalance,
      balanceType: currencyType
    };
  } catch (e) {
    console.error('Unexpected error during purchase:', e);
    return { success: false, error: 'Unexpected error during purchase' };
  }
}

export function subscribeToUserData(
  userId,
  { onWalletChange, onStarsChange, onInventoryChange }
) {
  const channel = supabase.channel(`user-updates-${userId}`);

  // Subscribe to euro wallet changes
  channel
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_wallet',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Wallet updated:', payload);
        onWalletChange?.(payload.new.euro);
      }
    )

    // Subscribe to stars changes in users table
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${userId}`
      },
      (payload) => {
        console.log('Stars updated:', payload);
        onStarsChange?.(payload.new.stars);
      }
    )

    // Subscribe to inventory changes
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_inventory',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Inventory updated:', payload);
        onInventoryChange?.(payload.new);
      }
    )

    .subscribe();
}
