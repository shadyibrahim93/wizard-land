'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems';

export const useSelectedPiece = (userId, fallback, themefallback) => {
  const selected = useSelectedItems(userId);

  const emoji = selected.piece?.emoji || null;
  const image = selected.piece?.image_url || null;
  const name = selected.piece?.className || null;
  const theme = selected.theme?.className || null;
  const realm = selected.realm?.className;

  useEffect(() => {
    if (realm) {
      window.localStorage.setItem('realm', realm);
    }
  }, [realm]);

  return {
    key: name || emoji || fallback, // used for comparison
    display: emoji,
    image: image ? (
      <img
        src={`/assets/images/board_pieces/${image}.webp`}
        className='mq-piece--img'
      />
    ) : (
      fallback
    ),
    theme: theme || themefallback,
    realm: realm
  };
};
