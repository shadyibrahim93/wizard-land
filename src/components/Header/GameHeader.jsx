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
          title='Games Menu Item | Wizard Land'
          itemTitle='GAMES'
          alt='Games Menu Item | Wizard Land'
          id='home-button'
        />
        <MenuItem
          imgSrc='shop.png'
          onHoverImgSrc='shop_active.png'
          onClick={showShop}
          playHoverSound={playChest}
          itemTitle='SHOP'
          title='Shop Menu Item | Wizard Land'
          alt='Shop Menu Item | Wizard Land'
        />
        <MenuItem
          imgSrc='inventory.png'
          onHoverImgSrc='inventory_active.png'
          onClick={showInventory}
          playHoverSound={playEquip}
          itemTitle='STASH'
          title='Stash Menu Item | Wizard Land'
          alt='Stash Menu Item | Wizard Land'
        />
        <MenuItem
          imgSrc='about.png'
          onHoverImgSrc='about_active.png'
          onClick={showAbout}
          playHoverSound={playPageFlip}
          itemTitle='ABOUT'
          title='About Menu Item | Wizard Land'
          alt='About Menu Item | Wizard Land'
        />
        {userId ? (
          <MenuItem
            imgSrc='logout.png'
            onHoverImgSrc='logout_active.png'
            onClick={onLogout}
            playHoverSound={playDoor}
            itemTitle='LOGOUT'
            title='Logout Menu Item | Wizard Land'
            alt='Logout Menu Item | Wizard Land'
          />
        ) : (
          <MenuItem
            imgSrc='login.png'
            onHoverImgSrc='login_active.png'
            onClick={onSignIn}
            playHoverSound={playDoor}
            itemTitle='LOGIN'
            title='Login Menu Item | Wizard Land'
            alt='Login Menu Item | Wizard Land'
          />
        )}
      </div>
    </header>
  );
};

export default HeaderContent;
