'use client';

import { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import Button from '../components/Button';
import { useUser } from '../context/UserContext.js';
import { supabase } from '../apiService.js';
import { updateProfile } from '../apiService.js';
import useSelectedItems from '../hooks/useSelectedItems.js';
import { toast } from 'react-toastify';

export default function ProfileModal({ showProfileModal, onClose, onSave }) {
  const { userName: initialName, userId, userEmail: initialEmail } = useUser();
  const [username, setUsername] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(false);
  const [remainingChanges, setRemainingChanges] = useState(2);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pull selected items: piece and board
  const selectedItems = useSelectedItems(userId);
  const pieceName =
    selectedItems.piece?.emoji || selectedItems.piece?.image_url || 'N/A';
  const boardName = selectedItems.theme?.class_name || 'N/A';
  const realmName = selectedItems.realm?.class_name || 'N/A';

  // Fetch current user metadata
  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
    }
    if (userId) fetchProfile();
  }, [userId]);

  // Update useEffect to fetch name_change_count
  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('name_change_count')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setRemainingChanges(2 - data.name_change_count);
      }
    }
    if (userId) fetchProfile();
  }, [userId, refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validate username: only letters, numbers, underscores
    const nicknameRegex = /^[a-zA-Z0-9_]+$/;
    if (!nicknameRegex.test(username)) {
      toast.error(
        'Username can only contain letters, numbers, and underscores (_).'
      );
      setSaving(false);
      return;
    }

    const { success, error } = await updateProfile({ userId, username, email });
    if (success) {
      onSave?.({ username, email });
      setEditName(false);
      setRefreshTrigger((prev) => prev + 1);
    } else {
      console.error('Update failed:', error);
    }
    setSaving(false);
  };

  if (!showProfileModal) return null;

  return (
    <div
      className='mq-modal-overlay'
      onClick={onClose}
    >
      <div
        className='mq-container mq-profile-page'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Edit Profile</h1>
          <button
            className='mq-close-btn'
            onClick={() => {
              onClose();
              setEditName(false);
            }}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          <form
            onSubmit={handleSubmit}
            className='mq-form'
          >
            {/* Username Field */}
            <div className='mq-form-group mq-form-editable'>
              <label className='mq-label'>
                Username{' '}
                {remainingChanges <= 0 ? (
                  <span className='mq-name-change easy'>
                    All name changes used
                  </span>
                ) : (
                  <span
                    className={`mq-name-change ${
                      remainingChanges === 2
                        ? 'hard'
                        : remainingChanges === 1
                        ? 'medium'
                        : 'easy'
                    }`}
                  >
                    <span>{remainingChanges}</span> Name changes remaining
                  </span>
                )}
              </label>
              <div className='mq-input-with-icon'>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='mq-input'
                  disabled={!editName}
                  required
                  maxLength={15}
                />
                <FiEdit2
                  className='mq-edit-icon'
                  onClick={() => {
                    if (remainingChanges > 0) {
                      setEditName((prev) => !prev);
                    } else {
                      toast.error('All name changes used');
                    }
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className='mq-form-group mq-form-editable'>
              <label className='mq-label'>Email</label>
              <div className='mq-input-with-icon'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='mq-input'
                  disabled
                />
                {/* <FiEdit2
                  className='mq-edit-icon'
                  onClick={() => setEditEmail((prev) => !prev)}
                /> */}
              </div>
            </div>

            {/* Disabled Fields */}
            <div className='mq-form-group'>
              <label className='mq-label'>Active Piece</label>
              <input
                type='text'
                value={pieceName}
                className='mq-input'
                disabled
              />
            </div>
            <div className='mq-form-group'>
              <label className='mq-label'>Active Board</label>
              <input
                type='text'
                value={boardName}
                className='mq-input'
                disabled
              />
            </div>
            <div className='mq-form-group'>
              <label className='mq-label'>Active Realm</label>
              <input
                type='text'
                value={realmName || realm}
                className='mq-input'
                disabled
              />
            </div>

            <div className='mq-modal-actions'>
              <Button
                type='button'
                className='mq-button'
                onClick={onClose}
                disabled={saving}
                text='Close'
              />
              {remainingChanges > 0 ? (
                <Button
                  type='submit'
                  className='mq-button'
                  disabled={saving}
                  text={saving ? 'Saving...' : 'Save'}
                />
              ) : (
                ''
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
