import MenuItem from '../menu/menuItem.jsx';
import {
  playChest,
  playEquip,
  playDoor,
  playPageFlip,
  playArrow
} from '../../hooks/useSound.js';
import { useRouter } from 'next/navigation';

const HeaderContent = ({
  userId,
  onSignIn,
  onLogout,
  showShop,
  showInventory,
  showAbout
}) => {
  const router = useRouter();

  return (
    <header>
      <div className='mq-header-container'>
        <MenuItem
          imgSrc='games.webp'
          onHoverImgSrc='games_active.webp'
          onClick={() => router.push('/')}
          playHoverSound={playArrow}
        />
        <MenuItem
          imgSrc='shop.webp'
          onHoverImgSrc='shop_active.webp'
          onClick={showShop}
          playHoverSound={playChest}
        />
        <MenuItem
          imgSrc='inventory.webp'
          onHoverImgSrc='inventory_active.webp'
          onClick={showInventory}
          playHoverSound={playEquip}
        />
        <MenuItem
          imgSrc='about.webp'
          onHoverImgSrc='about_active.webp'
          onClick={showAbout}
          playHoverSound={playPageFlip}
        />
        {userId ? (
          <MenuItem
            imgSrc='logout.webp'
            onHoverImgSrc='logout_active.webp'
            onClick={onLogout}
            playHoverSound={playDoor}
          />
        ) : (
          <MenuItem
            imgSrc='login.webp'
            onHoverImgSrc='login_active.webp'
            onClick={onSignIn}
            playHoverSound={playDoor}
            title='LOGIN'
          />
        )}
      </div>
    </header>
  );
};

export default HeaderContent;
