import MenuItem from '../menu/menuItem.jsx';
import {
  playChest,
  playEquip,
  playLogInOut,
  playPageFlip,
  playDoor
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
          imgSrc='games.png'
          onHoverImgSrc='games_active.png'
          onClick={() => router.push('/')}
          playHoverSound={playDoor}
        />
        <MenuItem
          imgSrc='shop.png'
          onHoverImgSrc='shop_active.png'
          onClick={showShop}
          playHoverSound={playChest}
        />
        <MenuItem
          imgSrc='inventory.png'
          onHoverImgSrc='inventory_active.png'
          onClick={showInventory}
          playHoverSound={playEquip}
        />
        <MenuItem
          imgSrc='about.png'
          onHoverImgSrc='about_active.png'
          onClick={showAbout}
          playHoverSound={playPageFlip}
        />
        {userId ? (
          <MenuItem
            imgSrc='logout.png'
            onHoverImgSrc='logout_active.png'
            onClick={onLogout}
            playHoverSound={playLogInOut}
          />
        ) : (
          <MenuItem
            imgSrc='login.png'
            onHoverImgSrc='login_active.png'
            onClick={onSignIn}
            playHoverSound={playLogInOut}
            title='LOGIN'
          />
        )}
      </div>
    </header>
  );
};

export default HeaderContent;
