import MenuItem from '../menu/menuItem.jsx';
import {
  playChest,
  playEquip,
  playPageFlip,
  playDoor,
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
          imgSrc='home.png'
          onHoverImgSrc='home_active.png'
          onClick={() => router.push('/')}
          playHoverSound={playArrow}
          title='GAMES'
          id='home-button'
        />
        <MenuItem
          imgSrc='shop.png'
          onHoverImgSrc='shop_active.png'
          onClick={showShop}
          playHoverSound={playChest}
          title='SHOP'
        />
        <MenuItem
          imgSrc='inventory.png'
          onHoverImgSrc='inventory_active.png'
          onClick={showInventory}
          playHoverSound={playEquip}
          title='STASH'
        />
        <MenuItem
          imgSrc='about.png'
          onHoverImgSrc='about_active.png'
          onClick={showAbout}
          playHoverSound={playPageFlip}
          title='ABOUT'
        />
        {userId ? (
          <MenuItem
            imgSrc='logout.png'
            onHoverImgSrc='logout_active.png'
            onClick={onLogout}
            playHoverSound={playDoor}
            title='LOGOUT'
          />
        ) : (
          <MenuItem
            imgSrc='login.png'
            onHoverImgSrc='login_active.png'
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
